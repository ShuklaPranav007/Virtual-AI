import React, { useContext, useEffect, useState, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const [loading, setLoading] = useState(false);
  
  // --- NEW STATE: Holds the button link and text ---
  const [actionLink, setActionLink] = useState(null); 
  
  const navigate = useNavigate();

  // Refs to manage lifecycle without triggering re-renders
  const recognitionRef = useRef(null);
  const isCooldown = useRef(false); // Prevents overlapping API calls

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    // Note: You can also change this to 'hi-IN' if you want it to LISTEN in Hindi!
    recognition.lang = 'en-US'; 

    // Retry Logic for Gemini API
    const callGeminiWithRetry = async (transcript, retries = 3, delay = 1000) => {
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
      window.currentUtterance = utterance; // Prevents Chrome from stopping audio early

      // --- ADDED HINDI VOICE LOGIC ---
      utterance.lang = 'hi-IN';
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang === 'hi-IN');
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      // -------------------------------

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      utterance.onend = () => {
        isCooldown.current = false; 
        if (recognitionRef.current) {
          try { recognitionRef.current.start(); } catch (e) {}
        }
      };

      utterance.onerror = () => {
        isCooldown.current = false;
        if (recognitionRef.current) {
          try { recognitionRef.current.start(); } catch (e) {}
        }
      }

      window.speechSynthesis.speak(utterance);
    };

    // --- OPTIMIZED ACTION BUTTON HANDLER ---
    const handleCommand = (data) => {
      const { type, userInput, response } = data;
      
      speak(response);
      const query = encodeURIComponent(userInput || "");

      let urlToOpen = "";
      let buttonText = "";

      if (type === "google_search") {
        urlToOpen = `https://www.google.com/search?q=${query}`;
        buttonText = "View Google Search";
      } 
      else if (type === "calculator_open") {
        urlToOpen = `https://www.google.com/search?q=calculator`;
        buttonText = "Open Calculator";
      } 
      else if (type === "instagram_open") {
        urlToOpen = `https://www.instagram.com/`;
        buttonText = "Open Instagram";
      } 
      else if (type === "facebook_open") {
        urlToOpen = `https://www.facebook.com/`;
        buttonText = "Open Facebook";
      } 
      else if (type === "weather-show") {
        urlToOpen = `https://www.google.com/search?q=${query || "weather"}`;
        buttonText = "View Weather";
      } 
      else if (type === "youtube_search" || type === "youtube_play") {
        urlToOpen = `https://www.youtube.com/results?search_query=${query}`;
        buttonText = "Open YouTube";
      }

      // Set the button state if a link was generated
      if (urlToOpen) {
        setActionLink({ url: urlToOpen, text: buttonText });
      } else {
        setActionLink(null);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase()) && 
        !isCooldown.current
      ) {
        isCooldown.current = true; 
        setActionLink(null); // Clear the old button when asking a new question

        try {
          console.log(`Sending command to backend: ${transcript}`);
          const data = await callGeminiWithRetry(transcript);
          console.log("Response received:", data);

          if (data && data.response) {
            handleCommand(data);
          } else {
            isCooldown.current = false;
          }
        } catch (error) {
          console.error("Failed to get response:", error);
          speak("Sorry, I'm having trouble connecting to my network right now.");
          isCooldown.current = false; 
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
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
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-5 gap-5">
      <button
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-lg absolute top-5 right-5 cursor-pointer hover:bg-gray-200 transition"
        onClick={handleLogOut}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Log Out"}
      </button>

      <button
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-lg absolute top-[100px] right-5 px-5 py-2 cursor-pointer hover:bg-gray-200 transition"
        onClick={() => navigate("/customize")}
      >
        Customize Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center flex-col">
        <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg border-2 border-white/20 bg-[#030326]">
          {userData?.assistantImage ? (
            <img
              src={userData.assistantImage}
              alt="Assistant"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-white">No Image Selected</div>
          )}
        </div>
        
        <h1 className="text-white mt-5 text-2xl font-bold text-center">
          I'm {userData?.assistantName || "your Assistant"}. How can I help you?
        </h1>

        {/* --- DYNAMIC ACTION BUTTON --- */}
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