const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
