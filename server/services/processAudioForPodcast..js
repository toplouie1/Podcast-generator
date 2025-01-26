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
	systemInstruction:
		"You are a podcast creator. Process audio input to produce a polished podcast featuring two speakers.",
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

		let file = await fileManager.getFile(uploadResult.file.name);
		while (file.state === FileState.PROCESSING) {
			process.stdout.write(".");
			await new Promise((resolve) => setTimeout(resolve, 10_000));
			file = await fileManager.getFile(uploadResult.file.name);
		}

		if (file.state === FileState.FAILED) {
			throw new Error("Audio processing failed.");
		}

		const result = await model.generateContent([
			"Create a detailed and accurate transcript of the uploaded audio file, distinguishing between two speakers.",
			{
				fileData: {
					fileUri: uploadResult.file.uri,
					mimeType: uploadResult.file.mimeType,
				},
			},
		]);

		const formattedTranscript = formatTranscript(result.response.text());
		return formattedTranscript;
	} catch (error) {
		throw new Error("Gemini processing failed");
	}
};

module.exports = { processAudioWithGemini };
