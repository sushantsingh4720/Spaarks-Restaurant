import { Router } from "express";
import { checkIsAdmin } from "../middlewares/auth.js";
import {
  addRestaurant,
  nearestToFarthest,
  specifiedRadiusRange,
  test,
} from "../controllers/restaurant.js";
const router = Router();

router.get("/test", test);
router.post("/addrestaurant", checkIsAdmin, addRestaurant);
router.get("/nearesttofarthest", nearestToFarthest);
router.get("/specifiedradiusrange", specifiedRadiusRange);
export default router;
