const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 60 * 1000,
    },
  })
);

const client = new OAuth2Client();

const getUserData = async (email) => {
  try {
    const [rows, fields] = await db.query(
      `SELECT * FROM user WHERE email = ?`,
      [email]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

app.get("/checkSession", (req, res) => {
  console.log(req.session.username);

  res.send("success");
});

app.post("/verifyGGToken", async (req, res) => {
  try {
    const idToken = req.body.tokenId;
    console.log("id", idToken);

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: [
        "484044523003-tu5oq5roldk96ill85ebj339vcibr3cf.apps.googleusercontent.com",
        "484044523003-esc9d3sse9oahimsugi7eujjasjt50p8.apps.googleusercontent.com",
        "484044523003-236sj9al7o41o1ojmou1bv4f0blrojoi.apps.googleusercontent.com",
        "484044523003-89fglg9jgp3dgvkds9dttnloctldgrt9.apps.googleusercontent.com",
      ],
    });

    const userData = await ticket.getPayload();

    if (userData.email_verified) {
      const [result] = await db.query(
        `SELECT email FROM user WHERE email = ?`,
        [userData.email]
      );

      if (result.length === 0) {
        const sql = "INSERT INTO user (`hoten`, `email`, `path`) VALUES (?)";
        const values = [userData.name, userData.email, userData.picture];

        await db.query(sql, [values]);
      }

      const data = await getUserData(userData.email);

      req.session.username = data.email;

      return res.status(200).send({ sessionId: req.sessionID, dataUser: data });
    } else {
      res.status(401).json("Unauthorized");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(4000, () => {
  console.log("Listener on 4000");
});
