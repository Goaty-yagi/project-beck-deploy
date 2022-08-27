const { closeDB, openDB } = require("../database");

const tableName = "scores";
const VALUES = "VALUES(?,?,?,?)";

async function createScoreTable(req, res) {
  db = await openDB();
  await db.run(
    `CREATE TABLE IF NOT EXISTS ${tableName}(UUID unique, username, quiz_type, score integer)`,
    (err, result) => {
      if (err) {
        console.log("err");
        res.status(400).json(err.message);
      } else {
        console.log("CREATED");
        createScore(req, res, db);
      }
    }
  );
}

function createScore(req, res, db) {
  const sql = `INSERT INTO ${tableName}(UUID, username, quiz_type, score) ${VALUES}`;
  const tableValues = Object.values(req.body);
  db.run(sql, tableValues, (err, result) => {
    if (err) return res.status(400).json(err.message);
    res.status(201).json("Created");
    closeDB(db);
  });
}

async function patchScoreData(req, res) {
  // receive only UUID and score in the body
  const id = req.body.UUID;
  delete req.body.UUID;
  const tableValues = Object.values(req.body); //order must be the same as SET below user, mail, UUID
  tableValues.push(id);
  await openDB();
  const sql = `UPDATE ${tableName} SET score = ? WHERE UUID = ?`;
  db.run(sql, tableValues, (err, result) => {
    if (err) {
      res.status(400).json({
        status: "error",
        message: err.message,
      });
    } else {
      res.status(200).send("UPDATE");
    }
  });
  closeDB(db);
}

//delete object
async function deleteScore(req, res) {
  db = await openDB();
  const id = req.body.UUID;
  sql = `DELETE FROM ${tableName} WHERE UUID = ?`;
  db.run(sql, [id], (err) => {
    if (err) return res.status(400).json(err.message);
    res.status(200).json("DELETED");
  });
  closeDB(db);
}

async function getScoreList(req, res) {
  db = await openDB();
  const sql_SELECT = `SELECT * FROM ${tableName}`;
  db.all(sql_SELECT, [], (err, rows) => {
    if (err) return res.status(400).json(err.message);
    res.status(200).json(rows);
  });
  closeDB(db);
}
async function getScoreOrderList(req, res) {
  db = await openDB();
  const quizType = req.params.type.split("=")[1];
  const sql_SELECT = `
        SELECT * ,
        RANK()OVER(ORDER BY score DESC) 
        FROM ${tableName}
        WHERE quiz_type = "${quizType}"
        LIMIT 10`;
  db.all(sql_SELECT, [], (err, rows) => {
    if (err) return res.status(400).json(err.message);
    res.status(200).json(rows);
  });
  closeDB(db);
}
async function getScoreById(req, res) {
  const id = req.params.id.split("=")[1];
  db = await openDB();
  const sql_SELECT = `
  SELECT * FROM ${tableName} WHERE UUID = "${id}"
  `;
  db.get(sql_SELECT, [], (err, rows) => {
    if (err) return res.status(400).json(err.message);
    res.status(200).json(rows);
  });
  closeDB(db);
}

module.exports = {
  createScoreTable,
  getScoreList,
  patchScoreData,
  deleteScore,
  getScoreOrderList,
  getScoreById,
};
