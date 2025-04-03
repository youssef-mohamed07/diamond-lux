import { Router } from "express";
import { AddUsers, deleteUsers, getUser, getUsers, updateUsers } from "./user.controller.js";
import { getUserToken } from "./token.controller.js";

const UserRouter = Router();

UserRouter.route('/').post(AddUsers).get(getUsers);
UserRouter.route('/token').get(getUserToken);
UserRouter.route('/:id').get(getUser).put(updateUsers).delete(deleteUsers);

export default UserRouter;