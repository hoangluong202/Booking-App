import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/users.js";

const UsersRouter = express.Router();

//UPDATE
UsersRouter.put("/:id", updateUser);

//DELETE
UsersRouter.delete("/:id", deleteUser);

//GET
UsersRouter.get("/:id", getUser);

//GET ALL
UsersRouter.get("/", getAllUsers);

export default UsersRouter;
