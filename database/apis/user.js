const { closeDB, openDB } = require("../database");

// 1, table-name, row items which num is not specific

const tableName = "users";
const VALUES = "VALUES(?,?,?,?)";

async function createUserTable(req, res) {
  db = await openDB();
  await db.run(
    `CREATE TABLE IF NOT EXISTS ${tableName}(UUID unique, user, mail, is_authenticated boolean)`,
    (err, result) => {
      if (err) {
        console.log("err");
        res.status(400).json(err.message);
      } else {
        console.log("CREATED");
        createUser(req, res, db);
      }
    }
  );
}

function createUser(req, res, db) {
  const sql = `INSERT INTO ${tableName}(UUID, user, mail, is_authenticated) ${VALUES}`;
  const tableValues = Object.values(req.body);
  if (!("is_authenticated" in tableValues)) {
    tableValues.push(false);
  }
  db.run(sql, tableValues, (err, result) => {
    if (err) return res.status(400).json(err.message);
    res.status(201).json("Created");
    closeDB(db);
  });
}

async function patchUserData(req, res) {
  // need to receive each column data
  const id = req.body.UUID;
  delete req.body.UUID;
  const tableValues = Object.values(req.body); //order must be the same as SET below user, mail, UUID
  tableValues.push(id);
  await openDB();
  const sql = `UPDATE ${tableName} SET user = ?, is_authenticated = ? WHERE UUID = ?`;
  db.run(sql, tableValues, (err, result) => {
    if (err) {
      //** even if the order is not correct, error will not occur.
      //so need to add some functionality for this.
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
async function deleteUser(req, res) {
  db = await openDB();
  const id = req.body.UUID;
  sql = `DELETE FROM ${tableName} WHERE UUID = ?`;
  db.run(sql, [id], (err) => {
    if (err) return res.status(400).json(err.message);
    res.status(200).json("DELETED");
  });
  closeDB(db);
}

async function getUserList(req, res) {
  db = await openDB();
  const sql_SELECT = `SELECT * FROM ${tableName}`;
  db.all(sql_SELECT, [], (err, rows) => {
    if (err) return res.status(400).json(err.message);
    res.status(200).json(rows);
  });
  closeDB(db);
}

async function getUserById(req, res) {
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
  createUserTable,
  getUserList,
  patchUserData,
  deleteUser,
  getUserById,
};
