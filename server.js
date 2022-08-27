const express = require("express");
const path = require("path");
const cors = require("cors");

const {
  createUserTable,
  getUserList,
  patchUserData,
  deleteUser,
  getUserById,
} = require("./database/apis/user");
const {
  createJsQuizTable,
  getJsQuizList,
  deleteJsQuiz,
  patchJsQuizData,
} = require("./database/apis/quizzes/js");
const {
  getScoreList,
  createScoreTable,
  deleteScore,
  patchScoreData,
  getScoreOrderList,
  getScoreById,
} = require("./database/apis/score");
const { deleteTable } = require("./database/database");

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());

app.use(cors());

// Read static file.
app.use(
  "/static",
  express.static(path.resolve(__dirname, "frontend", "static"))
);

//@ USER API
app.get("/api/user", (req, res) => {
  // deleteTable("users", res)
  getUserList(req, res);
});

app.post("/api/user", (req, res) => {
  createUserTable(req, res);
});

app.delete("/api/user", (req, res) => {
  deleteUser(req, res);
});

app.patch("/api/user", (req, res) => {
  // deleteTable("user")
  patchUserData(req, res);
});

app.get("/api/user-id/:id", (req, res) => {
  getUserById(req, res);
});


//@Js_quiz API

app.get("/api/quiz/js", (req, res) => {
  // deleteTable("jsQuiz", res)
  getJsQuizList(req, res);
});

app.post("/api/quiz/js", (req, res) => {
  createJsQuizTable(req, res);
});

app.delete("/api/quiz/js:id", (req, res) => {
  deleteJsQuiz(req, res);
});

app.patch("/api/quiz/js", (req, res) => {
  patchJsQuizData(req, res);
});

//@Score API

app.get("/api/score/:type", (req, res) => {
  getScoreOrderList(req, res);
});

app.post("/api/score", (req, res) => {
  createScoreTable(req, res);
});

app.delete("/api/score", (req, res) => {
  deleteScore(req, res);
});

app.patch("/api/score", (req, res) => {
  patchScoreData(req, res);
});

app.get("/api/score-id/:id", (req, res) => {
  getScoreById(req, res);
});


app.listen(port, () => console.log("server is listenning"));
