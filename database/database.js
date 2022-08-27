const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const tableName = "Terms";


function openDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      __dirname + "/DB.db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) return console.error(err.message);
        console.log("DB is successfully connected");
        resolve(db);
      }
    );
  });
}

// 1, table-name, row items which num is not specific
async function createTable(req, res) {
  const tableName = req.body[Object.keys(req.body).find(key => key === "tableName" )]
  delete req.body.tableName
  let tableItems ="("
  Object.keys(req.body).forEach((k, index) => {
    if(Object.keys(req.body).length === index +1) {
      tableItems +=  `"${k}"` + ")"
    } else {
      tableItems += `"${k}"` + ","
    } 
  })
  db = await openDB();
  console.log("check",tableName, tableItems)
  await db.run(`CREATE TABLE IF NOT EXISTS ${tableName} ${tableItems}`);
  // closeDB(db);
  console.log("GO_INSERT")
  insertDataIntoTable(req, res, tableName, tableItems, db)
}

function insertDataIntoTable(req, res, tableName, tableItems, db) {
  console.log("ININSERT", tableItems.length)
    const VALUES = () => {
      let val = "VALUES("
      for(let i = 0; i <= Object.keys(req.body).length -1; i++) {
        if(i === Object.keys(req.body).length -1) {
          val += "?)"
        } else {
          val += "?,"
        }
      }
      return val
    }
    console.log("val", VALUES())
    const sql = `INSERT INTO ${tableName} ${tableItems} ${VALUES()}`;
    const tableValues = Object.values(req.body)
    console.log(tableValues)
    db.run(sql, [tableValues], (err, result) => {
      if (err) return console.log(err.message);
      res.status(201).send("Created");
      closeDB(db);
    });
}

async function patchData(req, res) {
  console.log(req.params, req.body);
  db = await openDB();
  const sql = `UPDATE Terms SET term = ?, description = ? WHERE id = ?`;
  db.run(sql, [req.body.term, req.body.description, req.params.id], (err) => {
    if (err) {
      res.status(400).json({
        status: "error",
        message: err.message,
      });
    } else {
      console.log("breturn", db);
      res.status(200).send("UPDATE");
    }
  });
  closeDB(db);
}
// delete table
async function deleteTable(table, res) {
  db = await openDB();
  await db.run(`DROP TABLE ${table}`,(err,result) => {
    if(err) return res.send(err.message)
    return res.send(result )
  })
}
// db.run("DROP TABLE term")

//delete object
async function deleteData(req, res) {
  console.log("IN_DELETE", req.params);
  db = await openDB();
  sql = `DELETE FROM ${tableName} WHERE id = ?`;
  console.log("DELETE2");
  db.run(sql, [req.params.id], (err) => {
    if (err) return console.log(err.message);
    res.status(200).send("DELETED");
  });
  closeDB(db);
}

async function getALLData(req, res) {
  db = await openDB();
  const sql_SELECT = "SELECT * FROM Terms";
  console.log("DB", db);
  db.all(sql_SELECT, [], (err, rows) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(rows);
    }
  });
  closeDB(db);
}
function closeDB(db) {
  db.close((err) => {
    if (err) return console.error(err.message);
    console.log("DB_CLOSED");
  });
}

module.exports = {
  createTable,
  getALLData,
  insertDataIntoTable,
  patchData,
  deleteData,
  deleteTable,
  openDB,
  closeDB

};
