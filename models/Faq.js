// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   return sequelize.define('Faq', {
//     question: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     answer: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'inactive'),
//       defaultValue: 'active',
//     },
//   });
// };

const mongoose = require('mongoose');
const { Schema } = mongoose;

const faqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
}, { timestamps: true });

const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
