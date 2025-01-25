import "../css/PodcastGenerator.css";
import TranscriptAndAudioForm from "../components/TranscriptAndAudioForm";
import GeneratedPodcastPreview from "../components/GeneratedPodcastPreview";

export default function PodcastGenerator() {
	return (
		<div className="podcast-generator">
			<h1 className="app-title">Pod Gene</h1>
			<div className="content-wrapper">
				<TranscriptAndAudioForm />
				<GeneratedPodcastPreview />
			</div>
		</div>
	);
}
