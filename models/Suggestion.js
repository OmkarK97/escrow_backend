// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   return sequelize.define('Suggestion', {
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     suggestion: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'reviewed'),
//       defaultValue: 'pending',
//     },
//   });
// };

const mongoose = require('mongoose');
const { Schema } = mongoose;

const suggestionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId, // Reference to User model (using ObjectId)
    ref: 'User', // Reference to the "Users" model
    required: true, // user_id is required
  },
  suggestion: {
    type: String, // String type for the suggestion text
    required: true, // suggestion is required
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed'], // Enum for status
    default: 'pending', // Default value is 'pending'
  }
}, { timestamps: true });

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;
