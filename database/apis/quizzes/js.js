const { closeDB, openDB } = require("../../database")
const { v4: uuidv4 } = require("uuid");
// 1, table-name, row items which num is not specific

const tableName = "jsQuiz"
const VALUES = 'VALUES(?,?,?,?,?)'

async function createJsQuizTable(req, res) {
  console.log("CREATE", "JS_QUIZ")
    db = await openDB();
      await db.run(`CREATE TABLE IF NOT EXISTS ${tableName}(UUID unique, term, class integer, definition, tags)`,(err, result) => {
        if(err) {
          console.log("err")
          res.status(400).json(err.message)
        } else {
          console.log("CREATED")
          createJsQuiz(req, res, db)
        }
      });  
  }
  
  function createJsQuiz(req, res, db) {
      const sql = `INSERT INTO ${tableName}(UUID, term, class, definition, tags) ${VALUES}`;
      const tableValues = Object.values(req.body)
      tableValues.unshift(uuidv4())
      console.log(tableValues)
      db.run(sql, tableValues, (err, result) => {
        if (err) return res.status(400).json(err.message);
        res.status(201).json("Created");
        closeDB(db);
      });
  }
  
  async function patchJsQuizData(req, res) {
    const id = req.body.UUID
    delete req.body.UUID
    const tableValues = Object.values(req.body)//order must be the same as SET below user, mail, UUID
    tableValues.push(id)
    await openDB();
    const sql = `UPDATE ${tableName} SET term = ?, class = ?, definition = ?, tags = ? WHERE UUID = ?`;
    db.run(sql, tableValues, (err,result) => {
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
  async function deleteJsQuiz(req, res) {
    console.log("IN_DELETE", req.params);
    const id = req.params.id.split("=")[1]
    db = await openDB();
    // const id = req.body.UUID
    sql = `DELETE FROM ${tableName} WHERE UUID = ?`;
    db.run(sql, [id], (err) => {
      if (err) return res.status(400).json(err.message);
      res.status(200).json("DELETED");
      console.log("DELETED")
    });
    closeDB(db);
  }
  
  async function getJsQuizList(req, res) {
    db = await openDB();
    const sql_SELECT = `SELECT * FROM ${tableName}`;
    db.all(sql_SELECT, [], (err, rows) => {
      if (err) return res.status(400).json(err.message);
        res.status(200).json(rows);
    });
    closeDB(db);
  }

  module.exports = {
    createJsQuizTable,
    getJsQuizList,
    patchJsQuizData,
    deleteJsQuiz
  }
   