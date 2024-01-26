const express = require("express");
const morgan = require("morgan");
const moviesRouter = require("./routes/moviesRoutes");
const app = express();

const logger = function (req, res, next) {
    console.log("custom middleware called");
    next();
};

app.use(express.json());
app.use(morgan("combined"));
app.use(logger);
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
});

// using routes
app.use("/api/v1/movies", moviesRouter);

module.exports = app;
