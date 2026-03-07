import React, { useContext, useEffect, useState, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Use a ref to persist recognition instance across re-renders
  const recognitionRef = useRef(null);

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Fixed typo
    recognition.lang = 'en-US';

    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);
      // TODO: Call your backend API here with the transcript
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    // Store in ref to manage lifecycle
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.warn("Recognition already started or failed to start:", err);
    }

    // Cleanup: Stop recognition when the component unmounts
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-5 gap-5">
      <button 
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-lg absolute top-5 right-5 cursor-pointer" 
        onClick={handleLogOut}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Log Out"}
      </button>

      <button 
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-lg absolute top-[100px] right-5 px-5 py-2 cursor-pointer" 
        onClick={() => navigate("/customize")}
      > 
        Customize Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center flex-col">
        <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg border-2 border-white/20">
          {userData?.assistantImage ? (
            <img
              src={userData.assistantImage}
              alt="Assistant"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-white">No Image</div>
          )}
        </div>
        <h1 className="text-white mt-5 text-xl font-bold">
          I'm {userData?.assistantName || "your Assistant"}
        </h1>
      </div>
    </div>
  );
};

export default Home;