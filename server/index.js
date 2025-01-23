const express = require("express");
const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Podcast Generator Server is running!");
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
