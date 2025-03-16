import mongoose from "mongoose"

const IncentiveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["carbon_offset", "behavioral", "community", "token_based"],
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    actions: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
)

const UserIncentiveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Org",
      required: true,
    },
    incentive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incentive",
      required: true,
    },
    pointsEarned: {
      type: Number,
      required: true,
    },
    carbonOffset: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    redeemed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Incentive = mongoose.model("Incentive", IncentiveSchema)
const UserIncentive = mongoose.model("UserIncentive", UserIncentiveSchema)

export { Incentive, UserIncentive }

