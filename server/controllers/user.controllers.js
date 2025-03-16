import Org from "../models/org.models.js"

// Get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await Org.findById(req.user.id).select("-password -refreshToken")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    })
  } catch (error) {
    next(error)
  }
}

// Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { org_name, org_type } = req.body

    const user = await Org.findByIdAndUpdate(
      req.user.id,
      { org_name, org_type },
      { new: true, select: "-password -refreshToken" },
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    next(error)
  }
}

