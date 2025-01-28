const {
	GoogleAIFileManager,
	FileState,
} = require("@google/generative-ai/server");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { formatTranscript } = require("../helperMethods/formatTranscript");

const API_KEY = process.env.API_KEY;
const fileManager = new GoogleAIFileManager(API_KEY);
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

const supportedMimeTypes = [
	"audio/wav",
	"audio/mp3",
	"audio/mpeg",
	"audio/aiff",
	"audio/aac",
	"audio/ogg",
	"audio/flac",
];

const processAudioWithGemini = async (filePath, originalname, mimeType) => {
	try {
		console.log("File metadata:", { filePath, originalname, mimeType });
		if (!supportedMimeTypes.includes(mimeType)) {
			console.error("Error the mimeType is not supported");
			throw new Error("MimeType is not Supported");
		}

		const uploadResult = await fileManager.uploadFile(filePath, {
			mimeType,
			originalname,
		});

		console.log("---- uploadResult ----", uploadResult);

		let file = await fileManager.getFile(uploadResult.file.name);
		while (file.state === FileState.PROCESSING) {
			process.stdout.write(".");
			await new Promise((resolve) => setTimeout(resolve, 10_000));
			file = await fileManager.getFile(uploadResult.file.name);
		}

		if (file.state === FileState.FAILED) {
			throw new Error("Audio processing failed.");
		}
		console.log(" ---- file ---- ", file.state);

		const result = await model.generateContent([
			`
			  Create a professional, engaging podcast transcript based on the uploaded audio file. Follow these guidelines:
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
			`,
			{
				fileData: {
					fileUri: uploadResult.file.uri,
					mimeType: uploadResult.file.mimeType,
				},
			},
		]);
		console.log("--- result ---- ", result);

		console.log("unfiltered result", result.response.text());

		const formattedTranscript = formatTranscript(result.response.text());
		return formattedTranscript;
	} catch (error) {
		throw new Error("Gemini processing failed");
	}
};

module.exports = { processAudioWithGemini };
