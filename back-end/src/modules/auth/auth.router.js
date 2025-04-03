import { Router } from "express";
import { adminLogin, changeUserPassword} from "./auth.controller.js";
import { checkEmail } from "../../MiddleWares/checkEmail.js";

const authRouter=Router()


authRouter.post('/login',checkEmail,adminLogin)
authRouter.patch('/changepassword',changeUserPassword)


export default authRouter   