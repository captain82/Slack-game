const express = require("express");
const app = express();
let port = process.env.PORT || 3000;
const importData = require("./data.json")

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/players", (req, res) => {
    res.send(importData);
});

app.listen(port, () => {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});