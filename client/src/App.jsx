import "./App.css";
import { useState, useEffect } from "react";

function App() {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedTheme = localStorage.getItem("theme");
		return savedTheme ? savedTheme === "dark" : false;
	});

	useEffect(() => {
		if (isDarkMode) {
			document.body.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.body.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	return (
		<div className="app-container">
			<h1 className="app-title">Podcast Generator</h1>
			<div className="content-wrapper">
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

				<div className="right-section">
					<div className="generated-content">
						<p>
							<strong>Joe Rogan:</strong> Alright, folks, we’re live. Today,
							I’ve got an incredible guest, Dr. Jane Carter. She’s an
							evolutionary biologist who’s been studying the Amazon. Dr. Carter,
							thanks for being here.
						</p>
					</div>
				</div>
			</div>

			<button className="theme-toggle" onClick={toggleTheme}>
				{isDarkMode ? "🌙" : "🌞"}
			</button>
		</div>
	);
}

export default App;
