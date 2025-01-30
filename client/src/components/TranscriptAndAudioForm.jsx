import axios from "axios";
import { useState } from "react";
import "../css/TranscriptAndAudioForm.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function TranscriptAndAudioForm({ setGeneratedContent }) {
	const [file, setFile] = useState(null);
	const [uploadStatus, setUploadStatus] = useState("");
	const [transcriptText, setTranscriptText] = useState("");

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleGenerate = async () => {
		if (file) {
			const formData = new FormData();
			formData.append("audio", file);

			try {
				const response = await axios.post(
					`${API_URL}/api/upload-audio`,
					formData,
					{
						headers: { "Content-Type": "multipart/form-data" },
					}
				);
				setGeneratedContent(response.data.generatedContent);
				setUploadStatus(`File uploaded successfully: ${response.data.message}`);
			} catch (error) {
				setUploadStatus(
					`Error: ${error.response ? error.response.data : error.message}`
				);
			}
		} else if (transcriptText) {
			console.log("checking for transcript", transcriptText);
			try {
				const response = await axios.post(`${API_URL}/api/podcast-transcript`, {
					text: transcriptText,
				});
				setGeneratedContent(response.data.podcastScript);
				setUploadStatus("Podcast transcript generated successfully!");
			} catch (error) {
				setUploadStatus(
					`Error: ${error.response ? error.response.data : error.message}`
				);
			}
		} else {
			setUploadStatus("Please upload an audio file or enter a transcript.");
		}
	};

	return (
		<div className="left-section">
			<div className="form-group audio-group">
				<input
					type="file"
					id="audio"
					className="form-control audio-input"
					accept="audio/*"
					onChange={handleFileChange}
				/>
			</div>

			<div className="form-group transcript-group">
				<textarea
					id="transcript"
					className="form-control transcript-input"
					rows="10"
					placeholder="Enter transcript here"
					value={transcriptText}
					onChange={(e) => setTranscriptText(e.target.value)}
				></textarea>
			</div>

			<button className="generate-button" onClick={handleGenerate}>
				GENERATE
			</button>

			{uploadStatus && <p className="upload-status">{uploadStatus}</p>}
		</div>
	);
}
