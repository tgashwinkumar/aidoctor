import express, { json, urlencoded } from "express";
import cors from "cors"; // get MongoDB driver connection
import dataRoutes from "./routes/dataRoutes.js";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(json());
app.use(urlencoded());
app.get("/", async (req, res) => {
  res.send("Backup of External API - External API 2");
});

// perform a database connection when the server starts
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
