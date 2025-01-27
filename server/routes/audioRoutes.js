const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const {
	processAudioWithGemini,
} = require("../services/processAudioForPodcast.");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsDir);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

router.post("/upload-audio", upload.single("audio"), async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file Passed" });
	}
	const { path: filePath, originalname, mimetype } = req.file;
	try {
		const generatedContent = await processAudioWithGemini(
			filePath,
			originalname,
			mimetype
		);
		res.json({
			message: "File processed successfully",
			generatedContent,
		});
		// once it gets generated , i want to start generating the audio
		// but still send the transcript to client , so the web speech ai alerady has time to generate .
		console.log("checking if this gets hit", generatedContent);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
