import "../css/GeneratedPodcastPreview.css";

export default function GeneratedPodcastPreview({ generatedContent }) {
	return (
		<div className="right-section">
			<div className="generated-content">
				<h2>Podcast Generated ... </h2>
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
						Select A Audio File or Send A Text Transcript to Generate a Pod -
						Cast{" "}
					</p>
				)}
			</div>
		</div>
	);
}
