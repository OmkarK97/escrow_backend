// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   return sequelize.define('Disputes', {
//     deed_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Deeds',
//         key: 'id',
//       },
//     },
//     raised_by: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//     },
//     reason: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     resolution: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('open', 'resolved', 'closed'),
//       defaultValue: 'open',
//     },
//     resolved_at: {
//       type: DataTypes.TIME,
//       allowNull: true,
//     },
//     closed_at: {
//       type: DataTypes.TIME,
//       allowNull: true,
//     }
//   });
// };

const mongoose = require('mongoose');
const { Schema } = mongoose;

const disputeSchema = new Schema({
  deed_id: {
    type: Schema.Types.ObjectId, // Reference to Deed model (if using ObjectId)
    ref: 'Deed', // Reference to the "Deeds" model
    default: null, // Nullable for some disputes
  },
  raised_by: {
    type: Schema.Types.ObjectId, // Reference to User model (if using ObjectId)
    ref: 'User', // Reference to the "Users" model
    required: true, // Raised by must be present
  },
  reason: {
    type: String,
    required: true,
  },
  resolution: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'resolved', 'closed'],
    default: 'open',
  },
  resolved_at: {
    type: Date, // Date type for timestamps
    default: null, // Nullable for unresolved disputes
  },
  closed_at: {
    type: Date, // Date type for timestamps
    default: null, // Nullable for closed disputes
  },
}, { timestamps: true });

const Dispute = mongoose.model('Dispute', disputeSchema);

module.exports = Dispute;
