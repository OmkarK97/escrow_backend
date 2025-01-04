// const { DataTypes } = require("sequelize");

// module.exports = (sequelize) => {
//   return sequelize.define("DeedMilestones", {
//     deed_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "Deeds",
//         key: "id",
//       },
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     amount: {
//       type: DataTypes.DECIMAL,
//       allowNull: false,
//     },
//     timeline: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM(
//         "pending",
//         "in_progress",
//         "requested",
//         "completed",
//         "cancelled"
//       ),
//       defaultValue: "pending",
//     },
//   });
// };

const mongoose = require("mongoose");
const { Schema } = mongoose;

const deedMilestoneSchema = new Schema(
  {
    deed_id: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId here
      required: true,
      ref: "Deed", // Reference to the "Deeds" model
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Schema.Types.Decimal128, // Use Decimal128 for storing decimals
      required: true,
    },
    timeline: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "requested", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const DeedMilestone = mongoose.model("DeedMilestone", deedMilestoneSchema);

module.exports = DeedMilestone;
