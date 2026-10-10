import { Router, type IRouter } from "express";
import adminRouter from "./admin";
import contactRouter from "./contact";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(adminRouter);

export default router;
