const express = require("express");
var CryptoJS = require("crypto-js");
const app = express();
const cors = require("cors");
const pool = require(__dirname + "/db");
app.use(cors());
app.use(express.json());

const secrcet = "RReZm04b5eKmW8lJKVyj7WY0qnfcCjMCj7N";

app.post("/dossiers", async (req, res) => {
  
  const data = (JSON.parse(await decrypt(req.body.data)));
  
  try {
    const queryResponse =  await pool.query(
      `INSERT INTO dossiers ("Client", "Beheerder", "Type", "Verloop start", "Verloop stop", "Bestandslocatie", "Meer info", "Tijdlijn") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [  
        data['Client'] ?? "",
        data['Beheerder'] ?? "",
        data['Type'] ?? "",
        data['Verloop start'] ?  data['Verloop start']=== "" ? null :  data['Verloop start'] : null,
        data['Verloop stop'] ?  data['Verloop stop']=== "" ? null :  data['Verloop stop'] : null,
        data['Bestandslocatie'] ?? "",
        data['Meer info'] ?? "",
        data['Tijdlijn'] ?? ""
      ]
    );


    res.json(await encrypt(JSON.stringify(queryResponse.rows[0])));
  } catch (err) {
    res.json(await encrypt(JSON.stringify(err.message)));
    
  }
});

app.post("/dossiers/:id", async (req, res) => {
  
  let data = (JSON.parse(await decrypt(req.body.data)));

  try {
    const { id } = req.params;
    const queryResponse =  await pool.query(
      'UPDATE dossiers SET "Client" = $1, "Beheerder" = $2, "Type" = $3, "Bestandslocatie" = $4, "Meer info" = $5, "Tijdlijn" = $6 WHERE "id" = $7 RETURNING *;',
      [  
        data.Client ?? "",
        data.Beheerder ?? "",
        data.Type ?? "{}",
        data.Bestandslocatie ?? "",
        data["Meer info"] ?? "",
        data.Tijdlijn ?? "",
        data.id
      ]);


    res.json(await encrypt(JSON.stringify(queryResponse.rows[0])));
  } catch (err) {
    res.json(await encrypt(JSON.stringify(err.message)));
    
  }
});

app.post("/dossiertypes", async (req, res) => {
  const data = JSON.parse(await decrypt(req.body.data));
  try {
    const queryResponse =  await pool.query(
      "INSERT INTO dossier_types (\"naam\") VALUES ($1) RETURNING *;",
      [  
        data["dossierType"]
      ]
    );
    res.json(await encrypt(JSON.stringify(queryResponse.rows[0])));
  } catch (err) {
    res.json(await encrypt(JSON.stringify(err.message)));
  }
});

app.get("/dossiers", async (req, res) => {
  try {
    const allData = await pool.query("SELECT * FROM dossiers;");
    res.json(await encrypt(JSON.stringify(allData.rows)));
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/dossiertypes", async (req, res) => {
  try {
    const allData = await pool.query("SELECT * FROM dossier_types;");
    res.json(await encrypt(JSON.stringify(allData.rows)));
  } catch (err) {
    console.error(err.message);
  }
});


app.get("/dossiers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM dossiers WHERE id = $1;", [
      id
    ]);

    //res.json(todo.rows[0]);
    res.json(await encrypt(JSON.stringify(todo.rows[0])));
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/dossiertypes/:id", async (req, res) => {
  
  try {
    const id = await decrypt(req.body.toDelete);
    const deleteDos = await pool.query(
      `DELETE FROM dossier_types WHERE id = $1`,
      [  
        id
      ]
    );

    res.json({res: await encrypt("Dossier type was deleted!")});
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/dossiers/:id", async (req, res) => {
  
  try {
    const id = await decrypt(req.body.toDelete);
    const deleteDos = await pool.query(
      `DELETE FROM dossiers WHERE id = $1`,
      [  
        id
      ]
    );

    res.json({res: await encrypt("Dossier was deleted!")});
  } catch (err) {
    console.error(err.message);
  }
});



app.post("/users", async (req, res) => {
  
  const data = (JSON.parse(await decrypt(req.body.data)));
  
  try {
    const queryResponse =  await pool.query(
      `INSERT INTO users ("username", "mail", "salt", "secondSalt", "password", "role") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [  
        data['username'],
        data['mail'].toLowerCase(),
        data['salt'],
        data['secondSalt'],
        data['password'],
        data['role']
      ]
    );


    res.json(await encrypt(JSON.stringify(queryResponse.rows[0])));
  } catch (err) {
    res.json(await encrypt(JSON.stringify(err.message)));
    
  }
});

app.post("/login", async (req, res) => {
  
  const data = (JSON.parse(await decrypt(req.body.data)));
  
  try {
    const queryResponse =  await pool.query(
      `SELECT * FROM users WHERE mail = $1`,
      [  
        data['mail'].toLowerCase(),
      ]
    );

    res.json(await encrypt(JSON.stringify(queryResponse.rows[0])));
  } catch (err) {
    res.json(await encrypt(JSON.stringify(err.message)));
    
  }
});

app.post("/resetPW", async (req, res) => {
  
  let data = (JSON.parse(await decrypt(req.body.data)));

  try {
    const queryResponse =  await pool.query(
      'UPDATE users SET "password" = $1, "salt" = $2, "secondSalt" = $3 WHERE "mail" = $4 RETURNING *;',
      [  
        data.password,
        data.salt,
        data.secondSalt,
        data.mail.toLowerCase()
      ]);


    res.json(await encrypt(JSON.stringify(queryResponse.rows[0])));
  } catch (err) {
    res.json(await encrypt(JSON.stringify(err.message)));
    
  }
});

app.listen(8080, () => {
});

const encrypt = async (data) => {
  if(typeof data !== "string") data = data.toString()
  const msg = await CryptoJS.AES.encrypt(data, secrcet).toString();
  return msg
}

const decrypt = async (data) => {
  var bytes  = await CryptoJS.AES.decrypt(data, secrcet);
  return bytes.toString(CryptoJS.enc.Utf8);
}