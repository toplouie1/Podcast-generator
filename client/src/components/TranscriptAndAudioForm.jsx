import axios from "axios";
import { useState } from "react";
import "../css/TranscriptAndAudioForm.css";

export default function TranscriptAndAudioForm() {
	const [file, setFile] = useState(null);
	const [uploadStatus, setUploadStatus] = useState("");

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleGenerate = async () => {
		if (!file) {
			setUploadStatus("Please select an audio file.");
			return;
		}

		const formData = new FormData();
		formData.append("audio", file);

		try {
			const response = await axios.post(
				"http://localhost:8000/api/upload-audio",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setUploadStatus(
				`File uploaded successfully: ${response.data.originalname}`
			);
		} catch (error) {
			setUploadStatus(
				`Error: ${error.response ? error.response.data : error.message}`
			);
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
					rows="5"
					placeholder="Enter transcript here"
				></textarea>
			</div>

			<button className="generate-button" onClick={handleGenerate}>
				GENERATE
			</button>
			{uploadStatus && <p className="upload-status">{uploadStatus}</p>}
		</div>
	);
}
