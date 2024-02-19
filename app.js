const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = 5000;
require("./db");

app.use(express.json());
app.use(cors());

app.use("/api/user", require("./routes/user"));


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

