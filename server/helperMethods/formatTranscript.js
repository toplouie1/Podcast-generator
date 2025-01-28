function formatTranscript(transcript) {
	const lines = transcript.split("\n");
	const generatedContent = [];

	generatedContent.push({
		speaker: "",
		text: "Here's a transcript of the provided audio, differentiating between the two speakers. Note that due to the audio quality, some words might be slightly unclear and some sections are difficult to transcribe fully. This is the best interpretation based on what is audible.",
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
