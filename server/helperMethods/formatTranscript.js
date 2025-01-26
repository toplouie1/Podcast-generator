function formatTranscript(transcript) {
	const formatted = transcript
		.replace(/\*\*Speaker (\d+):\*\*/g, "Speaker $1:")
		.replace(/\[inaudible\]/g, "[inaudible]")
		.trim();

	const segments = formatted.split(/(Speaker \d+:)/).filter(Boolean);
	const transcriptArray = [];
	let currentSpeaker = "";

	segments.forEach((segment) => {
		if (segment.startsWith("Speaker")) {
			currentSpeaker = segment.trim();
		} else {
			transcriptArray.push({
				speaker: currentSpeaker,
				text: segment.trim(),
			});
		}
	});

	return transcriptArray;
}

module.exports = { formatTranscript };
