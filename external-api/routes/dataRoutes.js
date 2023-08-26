import { Router } from "express";
import data from "../data.js";
const router = Router();

router.get("/fetchdata", async (req, res) => {
  try {
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
