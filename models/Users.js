// const { DataTypes } = require('sequelize');

const { default: mongoose } = require("mongoose");

// module.exports = (sequelize) => {
//   return sequelize.define('Users', {
//     first_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     last_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     nick_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     role: {
//       type: DataTypes.ENUM('buyer', 'seller', 'admin'),
//       allowNull: true,
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true
//     }
//   });
// };

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    nick_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema)

module.exports = User;