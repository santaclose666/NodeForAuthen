const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const client = new OAuth2Client();

app.get("/", (req, res) => {
  res.send("NEW SERVER");
});

app.post("/verifyGGToken", async (req, res) => {
  try {
    const idToken = req.body.tokenId;

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: [
        "484044523003-tu5oq5roldk96ill85ebj339vcibr3cf.apps.googleusercontent.com",
        "484044523003-esc9d3sse9oahimsugi7eujjasjt50p8.apps.googleusercontent.com",
      ],
    });

    console.log(ticket.getPayload());
  } catch (error) {
    console.log(error);
  }
});

app.listen(4000, () => {
  console.log("Listener on 4000");
});
