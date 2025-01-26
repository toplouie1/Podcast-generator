import "../css/PodcastGenerator.css";
import TranscriptAndAudioForm from "../components/TranscriptAndAudioForm";
import GeneratedPodcastPreview from "../components/GeneratedPodcastPreview";
import { useState } from "react";

export default function PodcastGenerator() {
	const [generatedContent, setGeneratedContent] = useState([]);
	return (
		<div className="podcast-generator">
			<h1 className="app-title">Pod Gene</h1>
			<div className="content-wrapper">
				<TranscriptAndAudioForm setGeneratedContent={setGeneratedContent} />
				<GeneratedPodcastPreview generatedContent={generatedContent} />
			</div>
		</div>
	);
}
