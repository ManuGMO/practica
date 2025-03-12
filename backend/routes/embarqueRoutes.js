import express from "express";
import { crearEmbarque, getEnvios } from "../controllers/embarqueController.js";
const router = express.Router();



router.get("/getEnvios", getEnvios);


router.post("/crearEmbarque", crearEmbarque);




export default router;