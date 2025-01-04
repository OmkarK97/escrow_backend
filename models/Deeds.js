// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   return sequelize.define('Deeds', {
//     job_count: {
//       type: DataTypes.DECIMAL,
//       allowNull: false,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     payment_method: {
//       type: DataTypes.ENUM('Ethereum', 'Solana', 'Ton'),
//       allowNull: false,
//     },
//     payment_type: {
//       type: DataTypes.ENUM('one_time', 'milestone'),
//       allowNull: false,
//     },
//     amount: {
//       type: DataTypes.DECIMAL,
//       allowNull: true, // Nullable for milestones
//     },
//     timeline: {
//       type: DataTypes.INTEGER,
//       allowNull: true, // Nullable for milestones
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'in_progress', 'requested', 'completed', 'cancelled', 'disputed'),
//       defaultValue: 'pending',
//     },
//     buyer_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//     },
//     seller_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//     },
//     category: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     }
//   });
// };

const mongoose = require("mongoose");
const { Schema } = mongoose;

const deedSchema = new Schema(
  {
    job_count: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["Ethereum", "Solana", "Ton"],
      required: true,
    },
    payment_type: {
      type: String,
      enum: ["one_time", "milestone"],
      required: true,
    },
    amount: {
      type: Schema.Types.Decimal128,
      default: null,
    },
    timeline: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "in_progress",
        "requested",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "pending",
    },
    buyer_id: {
      type: String,
      ref: "User",
      default: null,
    },
    seller_id: {
      type: String,
      ref: "User", // Reference to the "Users" model
      default: null, // Nullable
    },
    category: {
      type: String,
      required: true,
    },
    milestones: [{ type: Schema.Types.ObjectId, ref: "DeedMilestone" }],
  },
  { timestamps: true }
);

const Deed = mongoose.model("Deed", deedSchema);

module.exports = Deed;
