import "../css/GeneratedPodcastPreview.css";

const speakText = (text) => {
	console.log("Starting speakText function...");
	const utterance = new SpeechSynthesisUtterance(text);

	if (!("speechSynthesis" in window)) {
		console.error("Web Speech API is not supported in this browser.");
		alert("Sorry, your browser does not support the Web Speech API.");
		return;
	}

	utterance.pitch = 1.2;
	utterance.rate = 1.2;
	utterance.volume = 1.3;

	const setVoice = () => {
		const synth = window.speechSynthesis;
		const voices = window.speechSynthesis.getVoices();
		// 23 38
		const voice = voices[23] || voices[0];
		// Eddy // Flo
		if (voice) {
			utterance.voice = voice;
			console.log("Selected voice:", utterance.voice);
		}
		synth.speak(utterance);
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

	const handlePlayPodcast = (event) => {
		event.preventDefault();
		// const textToSpeak = generatedContent
		// 	.map((entry) => (entry.text ? entry.text : ""))
		// 	.join(" ");

		speakText("cool never mind not cool");
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
