import "../css/TranscriptAndAudioForm.css";

export default function TranscriptAndAudioForm() {
	return (
		<div className="left-section">
			<div className="form-group audio-group">
				<input
					type="file"
					id="audio"
					className="form-control audio-input"
					accept="audio/*"
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
			<button className="generate-button">Generate</button>
		</div>
	);
}
