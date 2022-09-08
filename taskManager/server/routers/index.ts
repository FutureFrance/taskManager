import { Router } from "express";
import { userController } from '../controllers/UserController';
import { taskController } from '../controllers/TaskController';
import { checkAuth } from '../middlewares/CheckAuth';
import * as userValidate from '../validations/UserValidation';
import * as taskValidate from '../validations/TaskValidation';

const router = Router();

router.post("/registration", userValidate.registration, userController.registration);
router.post("/login", userValidate.login, userController.login);
router.get("/logout", userController.logout);
router.get("/refreshToken", userController.refresh);
router.post("/createTask", checkAuth, taskValidate.createTask, taskController.createTask);
router.post("/modifyTask", checkAuth, taskValidate.modifyTask, taskController.modifyTask);
router.post("/deleteTask", checkAuth, taskController.deleteTask);
router.get("/getTasks", checkAuth, taskController.getTasks);

export default router;