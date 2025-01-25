const express = require("express");
const cors = require("cors");
const audioRoutes = require("./routes/audioRoutes");
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.use("/api", audioRoutes);

app.get("/", (req, res) => {
	res.send("Podcast Generator Server is running!");
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
