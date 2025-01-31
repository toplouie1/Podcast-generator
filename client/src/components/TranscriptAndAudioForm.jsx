import axios from "axios";
import { useState, useEffect } from "react";
import "../css/TranscriptAndAudioForm.css";
const API_URL = import.meta.env.VITE_API_URL;

import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

export default function TranscriptAndAudioForm({ setGeneratedContent }) {
	const [file, setFile] = useState(null);
	const [uploadStatus, setUploadStatus] = useState("");
	const [transcriptText, setTranscriptText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [loadingIconIndex, setLoadingIconIndex] = useState(0);

	const loadingIcons = [
		<HourglassBottomIcon key="bottom" />,
		<HourglassEmptyIcon key="empty" />,
		<HourglassFullIcon key="full" />,
		<HourglassTopIcon key="top" />,
	];

	useEffect(() => {
		let interval;
		if (isLoading) {
			interval = setInterval(() => {
				setLoadingIconIndex(
					(prevIndex) => (prevIndex + 1) % loadingIcons.length
				);
			}, 250);
		}
		return () => clearInterval(interval);
	}, [isLoading]);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleGenerate = async () => {
		if (file || transcriptText) {
			setIsLoading(true);
			try {
				let response;
				if (file) {
					const formData = new FormData();
					formData.append("audio", file);

					response = await axios.post(`${API_URL}/api/upload-audio`, formData, {
						headers: { "Content-Type": "multipart/form-data" },
					});
					setGeneratedContent(response.data.generatedContent);
					setUploadStatus(
						`File uploaded successfully: ${response.data.message}`
					);
				} else if (transcriptText) {
					response = await axios.post(`${API_URL}/api/podcast-transcript`, {
						text: transcriptText,
					});
					setGeneratedContent(response.data.generatedContent);
					setUploadStatus("Podcast transcript generated successfully!");
				}
			} catch (error) {
				setUploadStatus(
					`Error: ${error.response ? error.response.data : error.message}`
				);
			} finally {
				setIsLoading(false);
			}
		} else {
			console.log("Please add a audio or text transcript");
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

			<button
				className="generate-button"
				onClick={handleGenerate}
				disabled={isLoading}
			>
				{isLoading ? loadingIcons[loadingIconIndex] : "GENERATE"}
			</button>
		</div>
	);
}
