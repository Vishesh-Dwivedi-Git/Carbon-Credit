import { Incentive, UserIncentive } from "../models/incentive.models.js"
import Org from "../models/org.models.js"
import { tokenContract } from "../utils/blockchain.js"

// Create a new incentive
export async function createIncentive(req, res, next) {
  try {
    const { title, description, category, points, actions } = req.body

    const incentive = new Incentive({
      title,
      description,
      category,
      points,
      actions,
    })

    await incentive.save()

    res.status(201).json({
      message: "Incentive created successfully",
      incentive,
    })
  } catch (error) {
    next(error)
  }
}

// Get all incentives
export async function getAllIncentives(req, res, next) {
  try {
    const incentives = await Incentive.find()

    res.status(200).json({
      message: "Incentives retrieved successfully",
      incentives,
    })
  } catch (error) {
    next(error)
  }
}

// Update an incentive
export async function updateIncentive(req, res, next) {
  try {
    const { id } = req.params
    const { title, description, category, points, actions } = req.body

    const incentive = await Incentive.findByIdAndUpdate(
      id,
      { title, description, category, points, actions },
      { new: true },
    )

    if (!incentive) {
      return res.status(404).json({ message: "Incentive not found" })
    }

    res.status(200).json({
      message: "Incentive updated successfully",
      incentive,
    })
  } catch (error) {
    next(error)
  }
}

// Delete an incentive
export async function deleteIncentive(req, res, next) {
  try {
    const { id } = req.params

    const incentive = await Incentive.findByIdAndDelete(id)

    if (!incentive) {
      return res.status(404).json({ message: "Incentive not found" })
    }

    res.status(200).json({
      message: "Incentive deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Award incentive points to a user
export async function awardIncentivePoints(req, res, next) {
  try {
    const { action, carbonOffset } = req.body
    const userId = req.user.id

    const org = await Org.findById(userId)
    if (!org) {
      return res.status(404).json({ message: "Organization not found" })
    }

    // Find matching incentives
    const incentives = await Incentive.find({ actions: action })
    if (incentives.length === 0) {
      return res.status(404).json({ message: "No matching incentives found for this action" })
    }

    // Calculate points based on the first matching incentive
    const incentive = incentives[0]
    const pointsEarned = calculatePoints(incentive.points, carbonOffset)

    // Create user incentive record
    const userIncentive = new UserIncentive({
      user: userId,
      incentive: incentive._id,
      pointsEarned,
      carbonOffset,
      action,
    })

    await userIncentive.save()

    // Update organization stars
    org.org_stars += pointsEarned
    await org.save()

    // Mint tokens if applicable
    if (incentive.category === "carbon_offset" && carbonOffset > 0) {
      try {
        const tokenAmount = Math.floor(carbonOffset / 10) // Example: 1 token per 10 units offset
        if (tokenAmount > 0) {
          const tx = await tokenContract.TransferFromOwnerOnLogin(org.walletAddress, tokenAmount)
          await tx.wait()
          org.CCtTokens += tokenAmount
          await org.save()
        }
      } catch (err) {
        console.error("Token minting failed:", err)
        // Continue execution even if token minting fails
      }
    }

    res.status(201).json({
      message: "Incentive points awarded successfully",
      userIncentive,
      pointsEarned,
    })
  } catch (error) {
    next(error)
  }
}

// Get user incentives
export async function getUserIncentives(req, res, next) {
  try {
    const userId = req.params.userId || req.user.id

    const userIncentives = await UserIncentive.find({ user: userId }).populate("incentive").sort({ createdAt: -1 })

    const totalPoints = userIncentives.reduce((sum, record) => sum + record.pointsEarned, 0)
    const totalCarbonOffset = userIncentives.reduce((sum, record) => sum + record.carbonOffset, 0)

    res.status(200).json({
      message: "User incentives retrieved successfully",
      userIncentives,
      stats: {
        totalPoints,
        totalCarbonOffset,
        totalRecords: userIncentives.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get leaderboard
export async function getLeaderboard(req, res, next) {
  try {
    // Aggregate total points by user
    const leaderboard = await UserIncentive.aggregate([
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$pointsEarned" },
          totalCarbonOffset: { $sum: "$carbonOffset" },
          actions: { $push: "$action" },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 10 },
    ])

    // Populate user details
    const populatedLeaderboard = await Org.populate(leaderboard, {
      path: "_id",
      select: "org_name org_type org_stars",
    })

    res.status(200).json({
      message: "Leaderboard retrieved successfully",
      leaderboard: populatedLeaderboard.map((entry) => ({
        user: entry._id,
        totalPoints: entry.totalPoints,
        totalCarbonOffset: entry.totalCarbonOffset,
        uniqueActions: [...new Set(entry.actions)].length,
      })),
    })
  } catch (error) {
    next(error)
  }
}

// Redeem incentive points
export async function redeemIncentivePoints(req, res, next) {
  try {
    const { rewardType, pointsUsed } = req.body
    const userId = req.user.id

    const org = await Org.findById(userId)
    if (!org) {
      return res.status(404).json({ message: "Organization not found" })
    }

    // Calculate total available points
    const totalPoints = await UserIncentive.aggregate([
      { $match: { user: org._id, redeemed: false } },
      { $group: { _id: null, total: { $sum: "$pointsEarned" } } },
    ])

    const availablePoints = totalPoints.length > 0 ? totalPoints[0].total : 0

    if (availablePoints < pointsUsed) {
      return res.status(400).json({
        message: "Insufficient points",
        availablePoints,
        pointsRequested: pointsUsed,
      })
    }

    // Redeem points logic - mark incentives as redeemed starting from oldest
    let pointsToRedeem = pointsUsed
    const incentivesToRedeem = await UserIncentive.find({
      user: org._id,
      redeemed: false,
    }).sort({ createdAt: 1 })

    for (const incentive of incentivesToRedeem) {
      if (pointsToRedeem <= 0) break

      if (incentive.pointsEarned <= pointsToRedeem) {
        incentive.redeemed = true
        pointsToRedeem -= incentive.pointsEarned
        await incentive.save()
      } else {
        // Split the incentive record
        const newIncentive = new UserIncentive({
          ...incentive.toObject(),
          _id: undefined,
          pointsEarned: incentive.pointsEarned - pointsToRedeem,
          redeemed: false,
        })

        incentive.pointsEarned = pointsToRedeem
        incentive.redeemed = true

        await Promise.all([incentive.save(), newIncentive.save()])
        pointsToRedeem = 0
      }
    }

    // Implement reward logic based on rewardType
    let reward
    switch (rewardType) {
      case "token_bonus":
        const tokenBonus = Math.floor(pointsUsed / 50) // Example: 1 token per 50 points
        try {
          const tx = await tokenContract.TransferFromOwnerOnLogin(org.walletAddress, tokenBonus)
          await tx.wait()
          org.CCtTokens += tokenBonus
          await org.save()
          reward = { type: "token_bonus", amount: tokenBonus }
        } catch (err) {
          console.error("Token bonus failed:", err)
          return res.status(500).json({ message: "Token bonus failed", error: err.message })
        }
        break
      case "discount_coupon":
        // Generate a discount code
        const discountCode = generateDiscountCode()
        reward = { type: "discount_coupon", code: discountCode, valuePercent: Math.min(50, pointsUsed / 10) }
        break
      default:
        reward = { type: "generic_reward", points: pointsUsed }
    }

    res.status(200).json({
      message: "Points redeemed successfully",
      pointsUsed,
      reward,
      remainingPoints: availablePoints - pointsUsed,
    })
  } catch (error) {
    next(error)
  }
}

// Get global impact report
export async function getGlobalImpact(req, res, next) {
  try {
    const totalImpact = await UserIncentive.aggregate([
      {
        $group: {
          _id: null,
          totalPoints: { $sum: "$pointsEarned" },
          totalCarbonOffset: { $sum: "$carbonOffset" },
          totalActions: { $sum: 1 },
        },
      },
    ])

    const actionBreakdown = await UserIncentive.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
          totalOffset: { $sum: "$carbonOffset" },
        },
      },
      { $sort: { totalOffset: -1 } },
    ])

    const orgTypeBreakdown = await UserIncentive.aggregate([
      {
        $lookup: {
          from: "orgs",
          localField: "user",
          foreignField: "_id",
          as: "orgData",
        },
      },
      { $unwind: "$orgData" },
      {
        $group: {
          _id: "$orgData.org_type",
          totalOffset: { $sum: "$carbonOffset" },
          organizations: { $addToSet: "$user" },
        },
      },
      {
        $project: {
          _id: 1,
          totalOffset: 1,
          uniqueOrganizations: { $size: "$organizations" },
        },
      },
      { $sort: { totalOffset: -1 } },
    ])

    res.status(200).json({
      message: "Global impact retrieved successfully",
      impact: totalImpact.length > 0 ? totalImpact[0] : { totalPoints: 0, totalCarbonOffset: 0, totalActions: 0 },
      actionBreakdown,
      organizationTypeBreakdown: orgTypeBreakdown,
    })
  } catch (error) {
    next(error)
  }
}

// Helper function to calculate points
function calculatePoints(basePoints, carbonOffset) {
  return Math.round(basePoints * (1 + (carbonOffset || 0) / 100))
}

// Helper function to generate discount code
function generateDiscountCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `ECO-${code}`
}

