const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const port = 3001;
const app = express();

// Middleware para permitir solicitações CORS
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));

const dbURI =
  "mongodb+srv://robsonpereira98:hlbdev1@hlbdev1.le63zst.mongodb.net/?retryWrites=true&w=majority&appName=hlbdev1";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(port))
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.log(err));

app.get("*", checkUser);
app.get("*", (req, res) => {
  const indexPath = path.resolve(__dirname, "client", "build", "index.html");
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(500).send("Something went wrong!");
    } else {
      res.sendFile(indexPath);
    }
  });
});
app.use(authRoutes);

console.log("[app.js] server running on port", port);

module.exports = app;
