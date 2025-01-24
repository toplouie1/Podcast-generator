import "../css/TranscriptAndAudioForm.css";

export default function TranscriptAndAudioForm() {
	return (
		<div className="left-section">
			<div className="form-group transcript-group">
				<label htmlFor="transcript" className="form-label">
					Transcript:
				</label>
				<textarea
					id="transcript"
					className="form-control transcript-input"
					rows="5"
					placeholder="Enter transcript here"
				></textarea>
			</div>
			<div className="form-group audio-group">
				<label htmlFor="audio" className="form-label">
					Audio:
				</label>
				<input
					type="file"
					id="audio"
					className="form-control audio-input"
					accept="audio/*"
				/>
			</div>
			<button className="generate-button">Generate</button>
		</div>
	);
}
