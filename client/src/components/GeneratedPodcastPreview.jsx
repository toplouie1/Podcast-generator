import { useState } from "react";
import "../css/GeneratedPodcastPreview.css";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import PauseSharpIcon from "@mui/icons-material/PauseSharp";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

let synth = window.speechSynthesis;
let currentUtterance = null;
let isPaused = false;

const loadVoices = () => {
	return new Promise((resolve) => {
		let voices = synth.getVoices();
		if (voices.length > 0) {
			resolve(voices);
		} else {
			synth.onvoiceschanged = () => resolve(synth.getVoices());
		}
	});
};

export default function GeneratedPodcastPreview({ generatedContent }) {
	const [hasStarted, setHasStarted] = useState(false);
	const [activeIndex, setActiveIndex] = useState(null);

	const speakSequentially = async (entries) => {
		for (let index = 0; index < entries.length; index++) {
			if (isPaused) return;

			const entry = entries[index];
			const voiceIndex = index % 2 === 0 ? 1 : 114;
			setActiveIndex(index + 1);

			console.log(`Speaking: "${entry.text}" with voice index: ${voiceIndex}`);

			await new Promise((resolve) => {
				const utterance = new SpeechSynthesisUtterance(entry.text);
				currentUtterance = utterance;

				loadVoices().then((voices) => {
					utterance.voice = voices[voiceIndex] || voices[0];
					synth.speak(utterance);
				});

				utterance.onstart = () => {
					console.log("Speech started:", entry.text);
				};

				utterance.onend = () => {
					console.log("Finished speaking:", entry.text);
					resolve();
				};

				utterance.onerror = (event) => {
					console.error("Speech synthesis error:", event);
					resolve();
				};
			});

			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	};

	const handlePlayPodcast = async (event) => {
		event.preventDefault();

		if (synth.speaking) {
			console.warn("Speech already in progress.");
			return;
		}

		const validEntries = generatedContent.filter(
			(entry) => entry.speaker && entry.speaker.trim() !== ""
		);

		isPaused = false;
		setHasStarted(true);
		await speakSequentially(validEntries);
	};

	const handlePause = () => {
		if (synth.speaking && !synth.paused) {
			synth.pause();
			isPaused = true;
			console.log("Speech paused.");
		}
	};

	const handleResume = () => {
		if (synth.paused) {
			synth.resume();
			isPaused = false;
			console.log("Speech resumed.");
		}
	};

	const handleRestart = (event) => {
		event.preventDefault();
		synth.cancel();
		isPaused = false;
		setHasStarted(false);
		setActiveIndex(null);
		setTimeout(() => {
			handlePlayPodcast(event);
		}, 300);
	};

	return (
		<div className="right-section">
			<div className="generated-content">
				<div className="generated-header">
					<h2>Podcast Generated</h2>
					<PlayCircleOutlineIcon
						className="play-icon"
						data-tooltip="Play"
						onClick={handlePlayPodcast}
					/>
					{hasStarted && (
						<>
							<RefreshIcon
								className="restart-icon"
								data-tooltip="Restart"
								onClick={handleRestart}
							/>
							<PauseSharpIcon
								className="pause-icon"
								data-tooltip="Pause"
								onClick={handlePause}
							/>
							<PlayArrowSharpIcon
								className="resume-icon"
								data-tooltip="Resume"
								onClick={handleResume}
							/>
						</>
					)}
				</div>
				<div className="transcript-container">
					{generatedContent.map((entry, index) => {
						if (!entry.speaker || !entry.text) return null;
						return (
							<div
								key={index}
								className={`transcript-entry ${
									index === activeIndex ? "active" : ""
								}`}
							>
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
