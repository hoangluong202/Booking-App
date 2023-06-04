import express from "express";
import {
  createHotel,
  deleteHotel,
  getAllHotels,
  getHotel,
  updateHotel,
} from "../controllers/hotels.js";

const hotelsRouter = express.Router();

//CREATE
hotelsRouter.post("/", createHotel);

//UPDATE
hotelsRouter.put("/:id", updateHotel);

//DELETE
hotelsRouter.delete("/:id", deleteHotel);

//GET
hotelsRouter.get("/:id", getHotel);

//GET ALL
hotelsRouter.get("/", getAllHotels);

export default hotelsRouter;
