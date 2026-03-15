import User from "../models/user.model.js";
import uploadCloudinary from "../config/cloudinary.js";
import {geminiResponse} from "../gemini.js";
import { response } from "express";
import moment from "moment/moment.js";

  // GET CURRENT USER

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "Get current user error" });
  }
};



  // UPDATE ASSISTANT

export const updateAssistant = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { assistantName, imageUrl } = req.body;

    let assistantImage;

    if (req.file) {
      assistantImage = await uploadCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(500).json({ message: "Update assistant error" });
  }
};


// ask assistant

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        
        const user = await User.findById(req.userId); 
        user.history.push(command)
        user.save()
        const getUserName = user.name;
        const getAssistantName = user.assistantName;

        const result = await geminiResponse(command, getAssistantName, getUserName);

        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ response: "Sorry, my brain got a little scrambled. Can you repeat that?" });
        }

        const gemResult = JSON.parse(jsonMatch[0]);
        const type = gemResult.type;

        // Helper function to pick randomly between two different responses
        const getRandomResponse = (options) => options[Math.floor(Math.random() * options.length)];

        switch (type) {
            case 'get_date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        `Today's date is ${moment().format('MMMM Do, YYYY')}.`,
                        `Looking at the calendar, today is ${moment().format('MMMM Do, YYYY')}.`
                    ])
                });

            case 'get_time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        `The current time is ${moment().format('hh:mm A')}.`,
                        `Right now, it is exactly ${moment().format('hh:mm A')}.`
                    ])
                });

            case 'get_day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        `Today is ${moment().format('dddd')}.`,
                        `We are halfway through the week, today is ${moment().format('dddd')}.`
                    ])
                });

            case 'get_month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        `We are currently in the month of ${moment().format('MMMM')}.`,
                        `The current month is ${moment().format('MMMM')}.`
                    ])
                });

            case 'general':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        gemResult.response, 
                        `Here is what I found: ${gemResult.response}`
                    ])
                });

            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        `Sure thing. ${gemResult.response}`,
                        `On it! ${gemResult.response}`
                    ])
                });

            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        `Opening it right now.`,
                        `Got it, launching that for you.`
                    ])
                });

            case 'weather-show':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        gemResult.response,
                        `Let me check the skies. ${gemResult.response}`
                    ])
                });

            default:
                return res.json({
                    type: 'unknown',
                    userInput: gemResult.userInput,
                    response: getRandomResponse([
                        "I'm not entirely sure how to help with that just yet.",
                        "That's a bit outside my capabilities at the moment."
                    ])
                });
        }

    } catch (error) {
        console.error("Error in askToAssistant:", error);
        return res.status(500).json({ response: "I encountered an internal error. Please try again later." });
    }
}