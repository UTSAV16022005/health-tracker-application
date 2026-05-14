const express = require("express");
const database = require("./connect");

let postRoutes = express.Router();

postRoutes.route("/posts").get((req, res) => {
    res.send("Posts route working");
});