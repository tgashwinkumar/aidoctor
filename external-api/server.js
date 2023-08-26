import express, { json, urlencoded } from "express"; // get MongoDB driver connection
import dataRoutes from "./routes/dataRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(json());
app.use(urlencoded());

app.use("/api/", dataRoutes);

app.get("/", async (req, res) => {
  res.send("External API 1");
});

// perform a database connection when the server starts
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
