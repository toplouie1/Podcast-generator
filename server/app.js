const express = require("express");
const cors = require("cors");
const audioRoutes = require("./routes/audioRoutes");
const transcriptRoutes = require("./routes/transcriptRoutes");
const app = express();

require("dotenv").config();

const compression = require("compression");
app.use(compression());

app.use(express.json());
app.use(cors());

const responseTime = require("response-time");
app.use(responseTime());

app.use("/api", audioRoutes);
app.use("/api", transcriptRoutes);

app.get("/", (req, res) => {
	res.send("Podcast Generator Server is running!");
});

app.get("*", (req, res) => {
	res.status(404).send("Page not found");
});

module.exports = app;
