const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
const { formatTranscript } = require("../helperMethods/formatTranscript");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	systemInstruction: `
	  You are a world-class podcast creator with a talent for crafting engaging, humorous, and personality-driven content. Your role is to transform audio input into a captivating podcast transcript that feels like a professional production. 
	  The podcast should feature two speakers, "Joe" and "Lex," who have distinct, memorable personalities. Joe is the funny, enthusiastic, and relatable type, while Lex is the witty, analytical, and slightly sarcastic type. 
	  Your goal is to create a transcript that is entertaining, informative, and immersive. Use storytelling techniques, witty banter, and audience engagement to make the podcast unforgettable. 
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
		  Create a professional, engaging podcast transcript based on the uploaded text. Follow these guidelines:
		  1. Format the conversation as a dialogue between two speakers, labeled "Joe" and "Lex."
		  2. Joe should be funny, enthusiastic, and relatable, while Lex should be witty, analytical, and slightly sarcastic.
		  3. Focus on the key points of the discussion and present it as a natural, dynamic conversation.
		  4. Add humor, witty banter, and personality-driven remarks to make the podcast entertaining.
		  5. Use storytelling techniques to make the content immersive and relatable.
		  6. Include audience engagement elements, such as rhetorical questions, call-to-actions, or hypothetical scenarios.
		  7. Do not include timestamps, filler words, or unnecessary details.
		  8. Simplify complex topics for a general audience without losing the essence.
		  9. Organize the content into logical segments with smooth transitions and a clear narrative arc.
		  10. Add creative flourishes, such as metaphors, analogies, or pop culture references, to make the content more vivid.
		  11. End the podcast with a memorable closing remark, teaser for the next episode, or call-to-action for the audience.

		  Transcript input: \n\n${text}`;

		const result = await model.generateContent(prompt);
		const formattedTranscript = formatTranscript(result.response.text());

		res.json({
			message: "Podcast script generated successfully",
			formattedTranscript,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
