// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   return sequelize.define('Logs', {
//     sender_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//     },
//     sender_name: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     recipient_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//     },
//     message: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     message_type: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     deed_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Deeds',
//         key: 'id',
//       },
//     },
//     dispute_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Disputes',
//         key: 'id',
//       },
//     },
//     isRead: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     }
//   });
// };

const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  sender_id: {
    type: Schema.Types.ObjectId, // Reference to User model (using ObjectId)
    ref: 'User', // Reference to the "Users" model
    default: null, // Nullable if there's no sender
  },
  sender_name: {
    type: String, // String type for sender name
    default: null, // Nullable
  },
  recipient_id: {
    type: Schema.Types.ObjectId, // Reference to User model (using ObjectId)
    ref: 'User', // Reference to the "Users" model
    default: null, // Nullable if there's no recipient
  },
  message: {
    type: String, // String type for message content
    default: null, // Nullable
  },
  message_type: {
    type: String, // String type for the type of message
    default: null, // Nullable
  },
  deed_id: {
    type: Schema.Types.ObjectId, // Reference to Deed model (using ObjectId)
    ref: 'Deed', // Reference to the "Deeds" model
    default: null, // Nullable if there's no related deed
  },
  dispute_id: {
    type: Schema.Types.ObjectId, // Reference to Dispute model (using ObjectId)
    ref: 'Dispute', // Reference to the "Disputes" model
    default: null, // Nullable if there's no related dispute
  },
  isRead: {
    type: Boolean, // Boolean type for isRead field
    default: false, // Default to false for unread messages
  }
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
