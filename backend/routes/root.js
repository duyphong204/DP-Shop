const userRoutes = require("./userRoutes");
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});
router.use("/users", userRoutes);

module.exports = router;
