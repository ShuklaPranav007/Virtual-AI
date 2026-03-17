import React, { useContext, useEffect, useState, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import listen from "../assets/listen.gif";
import talk from "../assets/talking.gif";

const Home = () => {
  const { userData, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const [loading, setLoading] = useState(false);
  const [actionLink, setActionLink] = useState(null);
  const [aiText, setAiText] = useState(""); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);

  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const isCooldown = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- UPDATED: Securely logout using LocalStorage ---
  const handleLogOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userData?.assistantName) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    const callGeminiWithRetry = async (
      transcript,
      retries = 3,
      delay = 1000,
    ) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await getGeminiResponse(transcript);
        } catch (error) {
          if (i < retries - 1 && error?.message?.includes("overloaded")) {
            console.log(`Retrying Gemini call (${i + 1}/${retries})...`);
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2;
          } else {
            throw error;
          }
        }
      }
    };

    const speak = (text) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.currentUtterance = utterance; 

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        isCooldown.current = false;
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        isCooldown.current = false;
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    const handleCommand = (data, originalTranscript) => {
      const { type, userInput, response } = data;
      const cleanResponse = response.replace(/^Here is what I found:\s*/i, "").trim();

      setCommandHistory((prevHistory) => [
        { user: userInput || originalTranscript, ai: cleanResponse },
        ...prevHistory,
      ]);

      setTimeout(() => {
        setAiText(cleanResponse); 
        speak(cleanResponse);
        
        const query = encodeURIComponent(userInput || "");
        let urlToOpen = "";
        let buttonText = "";

        if (type === "google_search") {
          urlToOpen = `https://www.google.com/search?q=${query}`;
          buttonText = "View Google Search";
        } else if (type === "calculator_open") {
          urlToOpen = `https://www.google.com/search?q=calculator`;
          buttonText = "Open Calculator";
        } else if (type === "instagram_open") {
          urlToOpen = `https://www.instagram.com/`;
          buttonText = "Open Instagram";
        } else if (type === "facebook_open") {
          urlToOpen = `https://www.facebook.com/`;
          buttonText = "Open Facebook";
        } else if (type === "weather-show") {
          urlToOpen = `https://www.google.com/search?q=${query || "weather"}`;
          buttonText = "View Weather";
        } else if (type === "youtube_search" || type === "youtube_play") {
          urlToOpen = `https://www.youtube.com/results?search_query=${query}`;
          buttonText = "Open YouTube";
        }

        if (urlToOpen) {
          setActionLink({ url: urlToOpen, text: buttonText });
        } else {
          setActionLink(null);
        }
      }, 1000); 
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase()) &&
        !isCooldown.current
      ) {
        isCooldown.current = true;
        setActionLink(null); 
        setAiText("Thinking...");

        try {
          console.log(`Sending command to backend: ${transcript}`);
          const data = await callGeminiWithRetry(transcript);
          console.log("Response received:", data);

          if (data && data.response) {
            handleCommand(data, transcript);
          } else {
            isCooldown.current = false;
            setAiText("I couldn't understand that.");
          }
        } catch (error) {
          console.error("Failed to get response:", error);
          const errorMsg = "Sorry, I'm having trouble connecting to my network right now.";
          setAiText(errorMsg);
          speak(errorMsg);
          isCooldown.current = false;
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        console.log("Listening timed out. It will restart automatically.");
      } else {
        console.error("Speech recognition error:", event.error);
        isCooldown.current = false;
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current && !window.speechSynthesis.speaking) {
        try {
          recognitionRef.current.start();
        } catch (err) {}
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      console.log(`Listening for "${userData.assistantName}"...`);
    } catch (err) {}

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [userData?.assistantName]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center overflow-hidden">
      
      {/* --- HOTSTAR-STYLE LEFT SIDEBAR WITH HISTORY --- */}
      <div 
        className={`absolute left-0 top-0 h-full ${
          isSidebarOpen ? "w-[320px]" : "w-[80px]"
        } bg-black/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 flex flex-col py-6 overflow-hidden shadow-2xl`}
      >
        
        {/* Toggle Button & User Profile */}
        <div className="flex items-center gap-4 px-5 w-full">
          <div 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-white/10 rounded-full transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          
          <div className={`flex flex-col transition-opacity duration-300 whitespace-nowrap ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            <span className="text-white font-semibold text-lg drop-shadow-md">
              {userData?.name || "User"}
            </span>
            <span className="text-blue-400 text-xs font-medium tracking-wider uppercase">
              Creator
            </span>
          </div>
        </div>

        {/* History Section */}
        <div className={`mt-8 w-full px-4 overflow-y-auto flex-1 transition-opacity duration-300 custom-scrollbar ${isSidebarOpen ? "opacity-100" : "opacity-0 invisible"}`}>
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4 px-2">
            Command History
          </h3>
          
          <div className="flex flex-col gap-3">
            {commandHistory.length === 0 ? (
              <p className="text-white/40 text-sm px-2 italic">No history yet. Try saying hi!</p>
            ) : (
              commandHistory.map((item, index) => (
                <div key={index} className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-sm">
                  <p className="text-white/90 text-sm mb-1">
                    <span className="text-blue-400 font-bold mr-1">You:</span> 
                    {item.user}
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    <span className="text-purple-400 font-bold mr-1">AI:</span> 
                    {item.ai}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- TOP BUTTONS (SIDE-BY-SIDE) --- */}
      <div className="absolute top-5 right-5 flex gap-4 z-10">
         <button
          className="px-6 py-2 h-[50px] text-black font-semibold bg-white rounded-full text-md hover:bg-gray-200 transition shadow-lg"
          onClick={() => navigate("/customize")}
        >
          Customize Assistant
        </button>
        <button
          className="px-6 py-2 h-[50px] text-black font-semibold bg-white rounded-full text-md hover:bg-gray-200 transition shadow-lg"
          onClick={handleLogOut}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Log Out"}
        </button>
      </div>

      {/* --- MAIN CENTER CONTENT --- */}
      <div className={`flex flex-col justify-center items-center w-full max-w-2xl mt-10 px-4 transition-all duration-300 ${isSidebarOpen ? "pl-[320px] md:pl-[320px]" : "pl-[80px]"}`}>
        
        {/* Assistant Avatar */}
        <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] flex justify-center items-center overflow-hidden rounded-full shadow-[0_0_40px_rgba(30,58,138,0.6)] border-4 border-white/20 bg-[#030326]">
          {userData?.assistantImage ? (
            <img
              src={userData.assistantImage}
              alt="Assistant"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-white text-lg">No Image Selected</div>
          )}
        </div>

        {/* Assistant Greeting */}
        <h1 className="text-white mt-8 text-2xl md:text-3xl font-bold text-center drop-shadow-md mb-2">
          I'm {userData?.assistantName || "your Assistant"}. How can I help you?
        </h1>

        {/* GIF & Text Stacked Vertically */}
        <div className="flex flex-col items-center justify-center w-full mt-4 gap-4">
          
          <div className="w-[100px] sm:w-[120px]">
            {isSpeaking ? (
              <img src={talk} alt="talking" className="w-full object-contain drop-shadow-lg" />
            ) : (
              <img src={listen} alt="listening" className="w-full object-contain drop-shadow-lg" />
            )}
          </div>

          {aiText && (
            <p className="text-white/70 text-sm sm:text-base font-medium text-center max-w-[400px] animate-fade-in">
              {aiText}
            </p>
          )}

        </div>

        {/* Dynamic Action Button */}
        {actionLink && (
          <a
            href={actionLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg transition transform hover:scale-105"
          >
            {actionLink.text}
          </a>
        )}
      </div>
    </div>
  );
};

export default Home;