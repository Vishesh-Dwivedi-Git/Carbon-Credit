import express from "express"
import {
  createIncentive,
  getAllIncentives,
  updateIncentive,
  deleteIncentive,
  awardIncentivePoints,
  getUserIncentives,
  getLeaderboard,
  redeemIncentivePoints,
  getGlobalImpact,
} from "../controllers/incentives.controllers.js"
import { authenticateToken, isGovernmentUser } from "../middlewares/auth.middlewares.js"

const router = express.Router()

// Incentive management (admin/government only)
router.post("/create", authenticateToken, isGovernmentUser, createIncentive)
router.put("/update/:id", authenticateToken, isGovernmentUser, updateIncentive)
router.delete("/delete/:id", authenticateToken, isGovernmentUser, deleteIncentive)

// Public incentive endpoints
router.get("/list", getAllIncentives)

// User incentive endpoints
router.post("/reward", authenticateToken, awardIncentivePoints)
router.post("/redeem", authenticateToken, redeemIncentivePoints)
router.get("/user/:userId?", authenticateToken, getUserIncentives)
router.get("/leaderboard", getLeaderboard)
router.get("/impact/global", getGlobalImpact)

export default router

