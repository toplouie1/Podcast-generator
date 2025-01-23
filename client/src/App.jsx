import "./App.css";
import { useState, useEffect } from "react";

function App() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setIsDarkMode(savedTheme === "dark");
		}
	}, []);

	useEffect(() => {
		if (isDarkMode) {
			document.body.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.body.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [isDarkMode]);

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
					<button className="generate-button">Generate</button>{" "}
				</div>

				<div className="right-section">
					<div className="generated-content">
						<div>
							<p>
								<strong>Joe Rogan:</strong> Alright, folks, we’re live. Today,
								I’ve got an incredible guest, Dr. Jane Carter. She’s an
								evolutionary biologist who’s been studying the Amazon. Dr.
								Carter, thanks for being here.
							</p>
							<p>
								<strong>Dr. Jane Carter:</strong> Thanks for having me, Joe. I’m
								excited to talk about it.
							</p>
							<p>
								<strong>Joe:</strong> So, the Amazon. That’s got to be one of
								the wildest places on Earth. What’s it like being there for
								months at a time?
							</p>
							<p>
								<strong>Dr. Carter:</strong> Its like stepping back in time. The
								biodiversity is incredible, but it’s also very humbling. You’re
								constantly reminded that humans are just one small part of this
								massive web of life.
							</p>
						</div>
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
