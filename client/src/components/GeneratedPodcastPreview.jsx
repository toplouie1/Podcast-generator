import "../css/GeneratedPodcastPreview.css";

const speakText = (text) => {
	console.log("Starting speakText function...");

	if (!("speechSynthesis" in window)) {
		console.error("Web Speech API is not supported in this browser.");
		alert("Sorry, your browser does not support the Web Speech API.");
		return;
	}

	console.log("Web Speech API is supported in this browser.");
	console.log("Text to be spoken:", text);

	const utterance = new SpeechSynthesisUtterance(text);
	console.log("Utterance created.");

	utterance.pitch = 1;
	utterance.rate = 1;
	utterance.volume = 1;
	console.log("Utterance properties set.");

	const setVoice = () => {
		const voices = window.speechSynthesis.getVoices();
		console.log("Available voices:", voices);

		if (voices.length === 0) {
			console.error("No voices available for speech synthesis.");
			alert("No voices available for speech synthesis.");
			return;
		}

		const voice = voices.find((v) => v.lang === "en-US") || voices[0];
		if (voice) {
			utterance.voice = voice;
			console.log("Selected voice:", utterance.voice);
		} else {
			console.error("No matching voice found.");
			alert("No matching voice found.");
			return;
		}

		window.speechSynthesis.speak(utterance);
		console.log("Speech synthesis started.");
	};

	if (window.speechSynthesis.getVoices().length > 0) {
		setVoice();
	} else {
		console.log("No voices available yet. Waiting for voices to load...");
		window.speechSynthesis.onvoiceschanged = setVoice;
	}

	utterance.onerror = (event) => {
		console.error("Speech synthesis error:", event);
		alert("An error occurred while trying to speak the text.");
	};
};

export default function GeneratedPodcastPreview({ generatedContent }) {
	console.log("generatedContent first --->>>>> ", generatedContent);

	const handlePlayPodcast = () => {
		console.log("handle Play Podcast");
		if (!generatedContent || generatedContent.length === 0) {
			alert("No content available to play.");
			return;
		}

		const textToSpeak = generatedContent
			.map((entry) => (entry.text ? entry.text : ""))
			.join(" ");

		console.log("Text to Speak:", textToSpeak);

		speakText(textToSpeak);
	};

	return (
		<div className="right-section">
			<div className="generated-content">
				<div className="generated-header">
					<h2>Podcast Generated</h2>
					<button className="generate-button" onClick={handlePlayPodcast}>
						Play Podcast
					</button>
				</div>
				<div className="transcript-container">
					{generatedContent.map((entry, index) => {
						if (!entry.speaker || !entry.text) return null;

						return (
							<div key={index} className="transcript-entry">
								<div className="speaker-label">{entry.speaker}</div>
								<div className="speaker-text">{entry.text}</div>
							</div>
						);
					})}
				</div>

				{!generatedContent.length && (
					<p>
						Select An Audio File or Send A Text Transcript to Generate a Podcast
					</p>
				)}
			</div>
		</div>
	);
}
