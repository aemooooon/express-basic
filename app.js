const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();
let movies = JSON.parse(fs.readFileSync("./data/movies.json"));

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

const createMovie = (req, res) => {
    const newId = movies[movies.length - 1].id + 1;

    const newMovie = Object.assign({ id: newId }, req.body);
    movies.push(newMovie);

    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                movie: newMovie,
            },
        });
    });
};

const getAllMovies = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestedAt,
        count: movies.length,
        data: {
            movies: movies,
        },
    });
};

const getMovie = (req, res) => {
    const id = req.params.id * 1;
    let movieToRead = movies.find((el) => el.id === id);
    if (!movieToRead) {
        res.status(404).json({
            status: "fail",
            message: `Movie with id ${id} is not found.`,
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            movie: movieToRead,
        },
    });
};

const updateMovie = (req, res) => {
    const id = req.params.id * 1;
    const movieToUpdate = movies.find((el) => el.id === id);
    if (!movieToUpdate) {
        res.status(404).json({
            status: "fail",
            message: `Movie with id ${id} is not found.`,
        });
    }
    let index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;
    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
        res.status(200).json({
            status: "success",
            data: {
                movie: movieToUpdate,
            },
        });
    });
};

const deleteMovie = (req, res) => {
    const id = req.params.id * 1;
    const movieToDelete = movies.find((el) => el.id === id);

    if (!movieToDelete) {
        return res.status(404).json({
            status: "fail",
            message: `Movie with id ${id} is not found to delete.`,
        });
    }

    const index = movies.indexOf(movieToDelete);
    movies.splice(index, 1);

    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
        res.status(204).json({
            status: "success",
            data: {
                movie: null,
            },
        });
    });
};

// app.post("/api/v1/movies", createMovie);
// app.get("/api/v1/movies", getAllMovies);
// app.get("/api/v1/movies/:id", getMovie);
// app.patch("/api/v1/movies/:id", updateMovie);
// app.delete("/api/v1/movies/:id", deleteMovie);

app.route("/api/v1/movies").get(getAllMovies).post(createMovie);
app.route("/api/v1/movies/:id").get(getMovie).patch(updateMovie).delete(deleteMovie);

// create a server
const port = 3000;
app.listen(port, () => {
    console.log("Server has started.");
});
