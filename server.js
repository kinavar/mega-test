const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, "src")))

app.use("/api/files", (req, res) => {
    res.status(200).json({status: "ok"})
});

// app.use("/api/files", (req, res) => {
//     res.status(500).json({status: "fail"})
// });

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "src", "index.html"))
})


app.listen(3000, () => {
    console.log("runnning at localhost:3000")
})
