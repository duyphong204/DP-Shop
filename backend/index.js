const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const routes = require("./routes/root");

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);
connectDB();

app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
