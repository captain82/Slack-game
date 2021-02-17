const express = require("express");
const app = express();
let port = process.env.port || 3000;
const importData = require("./data.json")

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/players", (req, res) => {
    res.send(importData);
})

app.listen(port, () => {
    console.log(`Example app is listening on port http://localhost:${port}`);
})