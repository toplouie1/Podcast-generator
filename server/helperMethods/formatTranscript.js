function formatTranscript(transcript) {
	transcript = transcript.replace(/\([^)]*\)/g, "");
	transcript = transcript.replace(/\*\*\([^)]*\)\*\*/g, "");

	const lines = transcript.split("\n");
	const generatedContent = [];

	generatedContent.push({
		speaker: "",
		text: "Audio Transformed",
	});

	for (const line of lines) {
		if (!line.trim()) continue;
		if (line.startsWith("**Joe:**") || line.startsWith("**Lex:**")) {
			const speaker = line.startsWith("**Joe:**") ? "Speaker 1:" : "Speaker 2:";
			const text = line.replace(/^\*\*(Joe|Lex):\*\*/, "").trim();

			generatedContent.push({ speaker, text });
		} else {
			if (generatedContent.length > 0) {
				generatedContent[generatedContent.length - 1].text += " " + line.trim();
			}
		}
	}

	return generatedContent;
}

module.exports = { formatTranscript };
