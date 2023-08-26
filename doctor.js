import express, { json, urlencoded } from "express";
import cors from "cors"; // get MongoDB driver connection
import fs from "fs";
let fps = fs.promises;
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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", // defaults to process.env["OPENAI_API_KEY"]
});

const app = express();
const PORT = process.env.PORT || 7777;

app.use(cors());
app.use(json());
app.use(urlencoded());

app.post("/backup-server", async (req, res) => {
  try {
    let fileData = await fps.readFile("./external-api/server.js", "utf8");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/cors-error", async (req, res) => {
  try {
    let fileData = await fps.readFile("./external-api/server.js", "utf8");
    fileData = fileData.toString();
    let content = `For the given express code : \n ${fileData} \n\n Add CORS and provide only the expected code with no desciption/explanation. Assume cors is installed already`;
    console.log(content);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const result = completion.choices[0].message.content;

    console.log(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/mismatch-keys", async (req, res) => {
  try {
    const { jsonData } = req.body;
    let fileData = await fps.readFile("./frontend/src/App.js", "utf8");
    fileData = fileData.toString();

    let fileData2 = fileData
      .split("\n")
      .map((line, idx) => `${idx + 1} ${line}`)
      .join("\n");

    let content = `For the given JSON Data: \n ${jsonData} \n\n 
            And given the below React Code : \n ${fileData2} \n\n Fix the key mappings in the parameter for DataTable, as per the JSON data provided. Proivde answer without ellipsis in the format
            "<CODE ORIGINAL> --> <NEW CODE>" ONLY.
            Check for bracket closing as same as original code`;

    console.log(content);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const result = completion.choices[0].message.content;

    const oCode = result.split("-->")[0].trim().slice(1, -1);
    const nCode = result.split("-->")[1].trim().slice(1, -1);

    console.log(oCode, nCode);
    fileData = fileData.replace(oCode, nCode);
    await fps.writeFile("./frontend/src/App.js", fileData, "utf8");
    res.send({ success: true, message: "Successfully updated the code!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/", async (req, res) => {
  res.send("External API 1");
});

// perform a database connection when the server starts
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
