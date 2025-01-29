import { useState, useEffect } from "react";
import PodcastGenerator from "./components/PodcastGenerator";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import "./css/App.css";

export default function App() {
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
		setIsDarkMode(!isDarkMode);
	};

	return (
		<div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
			<button className="theme-toggle" onClick={toggleTheme}>
				{isDarkMode ? <ToggleOffIcon /> : <ToggleOnIcon />}
			</button>
			<PodcastGenerator />
		</div>
	);
}
