import "../css/GeneratedPodcastPreview.css";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import PauseSharpIcon from "@mui/icons-material/PauseSharp";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

let synth = window.speechSynthesis;

const speakText = (text, voiceIndex) => {
	console.log("Starting speakText function...");
	const utterance = new SpeechSynthesisUtterance(text);

	if (!("speechSynthesis" in window)) {
		console.error("Web Speech API is not supported in this browser.");
		alert("Sorry, your browser does not support the Web Speech API.");
		return;
	}

	const setVoice = () => {
		const voices = synth.getVoices();
		const voice = voices[voiceIndex];

		if (voice) {
			utterance.voice = voice;
			console.log("Selected voice:", utterance.voice);
		}
		synth.speak(utterance);
	};

	if (synth.getVoices().length > 0) {
		setVoice();
	} else {
		console.log("No voices available yet. Waiting for voices to load...");
		synth.onvoiceschanged = setVoice;
	}

	utterance.onerror = (event) => {
		console.error("Speech synthesis error:", event);
		alert("An error occurred while trying to speak the text.");
	};
};

export default function GeneratedPodcastPreview({ generatedContent }) {
	const handlePlayPodcast = (event) => {
		event.preventDefault();
		const validEntries = generatedContent.filter(
			(entry) => entry.speaker && entry.speaker.trim() !== ""
		);
		validEntries.forEach((entry, index) => {
			const voiceIndex = index % 2 === 0 ? 1 : 114;
			setTimeout(() => {
				console.log(
					`Speaking: "${entry.text}" with voice index: ${voiceIndex}`
				);
				speakText(entry.text, voiceIndex);
			}, index * 1000);
		});
	};

	return (
		<div className="right-section">
			<div className="generated-content">
				<div className="generated-header">
					<h2>Podcast Generated</h2>
					<div>
						<PlayCircleOutlineIcon onClick={handlePlayPodcast} />
						<PauseSharpIcon onClick={() => synth.pause()} />
						<PlayArrowSharpIcon onClick={() => synth.resume()} />
					</div>
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
