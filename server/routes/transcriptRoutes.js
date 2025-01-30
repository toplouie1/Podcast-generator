const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const router = express.Router();
const { formatTranscript } = require("../helperMethods/formatTranscript");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	systemInstruction: `
	  You are a world-class podcast creator with a talent for crafting engaging, humorous, and personality-driven content. Your role is to transform a raw text transcript into a captivating podcast script that feels like a professional production. 
	  The podcast should feature two speakers, "Joe" and "Lex," who have distinct, memorable personalities. Joe is the funny, enthusiastic, and relatable type, while Lex is the witty, analytical, and slightly sarcastic type. 
	  Your goal is to create a script that is entertaining, informative, and immersive. Use storytelling techniques, witty banter, and audience engagement to make the podcast unforgettable. 
	  Avoid filler words, timestamps, or overly formal language. The final output should feel like a top-tier podcast with a loyal fanbase.
	`,
});

router.post("/podcast-transcript", async (req, res) => {
	const { text } = req.body;
	if (!text) {
		return res.status(400).json({ error: "No transcript text provided" });
	}

	try {
		const prompt = `
		Create a professional, engaging transcript based on the provided conversation. Follow these guidelines:
		1. Format the dialogue between two speakers, labeled "Joe" and "Lex."
		2. Joe should be funny, enthusiastic, and relatable, while Lex should be witty, analytical, and slightly sarcastic.
		3. Ensure the transcript reads naturally, capturing the flow of conversation without making it feel too scripted or stiff.
		4. Maintain a balance between humor and insight, keeping the conversation engaging and informative.

		**Transcript Input:**  
		${text}
		`;

		const result = await model.generateContent(prompt);
		const generatedContent = formatTranscript(result.response.text());
		res.json({
			message: "Podcast text script updated successfully",
			generatedContent,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
