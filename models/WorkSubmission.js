// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   return sequelize.define('WorkSubmission', {
//     deed_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Deeds',
//         key: 'id',
//       },
//     },
//     submitted_by: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//     },
//     file_link: {
//       type: DataTypes.STRING,
//       allowNull: true, // For uploaded files
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'approved', 'revision_requested', 'fraud_reported'),
//       defaultValue: 'pending',
//     },
//   });
// };

const mongoose = require('mongoose');
const { Schema } = mongoose;

const workSubmissionSchema = new Schema({
  deed_id: {
    type: Schema.Types.ObjectId, // Reference to Deed model (using ObjectId)
    ref: 'Deed', // Reference to the "Deeds" model
    required: true, // deed_id is required
  },
  submitted_by: {
    type: Schema.Types.ObjectId, // Reference to User model (using ObjectId)
    ref: 'User', // Reference to the "Users" model
    required: true, // submitted_by is required
  },
  file_link: {
    type: String, // String type for file link (for uploaded files)
    default: null, // Nullable if no file uploaded
  },
  description: {
    type: String, // String type for description
    default: null, // Nullable if no description
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'revision_requested', 'fraud_reported'], // Enum for status
    default: 'pending', // Default value is 'pending'
  }
}, { timestamps: true });

const WorkSubmission = mongoose.model('WorkSubmission', workSubmissionSchema);

module.exports = WorkSubmission;
