// const Sequelize = require("sequelize");
// const dbConfig = require("../config/config");
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   // operatorsAliases: false,
//   logging: false,
//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle,
//   },
//   dialectOptions: {
//     connectTimeout: 30000,
//   },
//   port: dbConfig.PORT,
//   charset: "utf8mb4",
// });

// const User = require("./Users")(sequelize);
// const Deed = require("./Deeds")(sequelize);
// const Dispute = require("./Disputes")(sequelize);
// const DeedMilestones = require("./DeedMilestones")(sequelize);
// const Log = require("./Logs")(sequelize);
// const WorkSubmission = require("./WorkSubmission")(sequelize);
// const Faq = require("./Faq")(sequelize);
// const Suggestion = require("./Faq")(sequelize);

// // Define relationships between User and Deed
// User.hasMany(Deed, { foreignKey: "buyer_id" });
// User.hasMany(Deed, { foreignKey: "seller_id" });
// Deed.belongsTo(User, { foreignKey: "buyer_id", as: "Buyer" });
// Deed.belongsTo(User, { foreignKey: "seller_id", as: "Seller" });

// // Deed associations (Updated)
// Deed.hasMany(DeedMilestones, { foreignKey: "deed_id", as: "milestones" });
// DeedMilestones.belongsTo(Deed, { foreignKey: "deed_id" }); // No alias needed here

// // Dispute associations
// Dispute.belongsTo(Deed, { foreignKey: "deed_id" });
// Dispute.belongsTo(User, { foreignKey: "raised_by", as: "Raiser" });

// // Log associations
// Log.belongsTo(User, { foreignKey: "sender_id", as: "Sender" });
// Log.belongsTo(User, { foreignKey: "recipient_id", as: "Recipient" });
// Log.belongsTo(Deed, { foreignKey: "deed_id" });
// Log.belongsTo(Dispute, { foreignKey: "dispute_id" });

// module.exports = {
//   sequelize,
//   User,
//   Deed,
//   DeedMilestones,
//   Dispute,
//   WorkSubmission,
//   Log,
//   Faq,
//   Suggestion,
// };

const mongoose = require("mongoose");
const { HOST } = require("../config/config");

if (!HOST) {
  throw new Error("Host is not defined in .env file");
}

mongoose
  .connect(HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 5,
    connectTimeoutMS: 30000, // Timeout for connecting
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Databse connection error:", err));

const User = require("./Users");
const Deed = require("./Deeds");
const Dispute = require("./Disputes");
const DeedMilestone = require("./DeedMilestones");
const Log = require("./Logs");
const WorkSubmission = require("./WorkSubmission");
const Faq = require("./Faq");
const Suggestion = require("./Suggestion");

// Relationships in Mongoose

// User has many Deeds
User.schema.virtual("buyerDeeds", {
  ref: "Deed",
  localField: "_id",
  foreignField: "buyer_id", // Fetch deeds where the user is the buyer
});

User.schema.virtual("sellerDeeds", {
  ref: "Deed",
  localField: "_id",
  foreignField: "seller_id", // Fetch deeds where the user is the seller
});

// Dispute belongs to Deed and User
Dispute.schema.virtual("deed", {
  ref: "Deed",
  localField: "deed_id",
  foreignField: "_id",
});
Dispute.schema.virtual("raiser", {
  ref: "User",
  localField: "raised_by",
  foreignField: "_id",
});

// Log belongs to User and Deed
Log.schema.virtual("sender", {
  ref: "User",
  localField: "sender_id",
  foreignField: "_id",
});
Log.schema.virtual("recipient", {
  ref: "User",
  localField: "recipient_id",
  foreignField: "_id",
});
Log.schema.virtual("deed", {
  ref: "Deed",
  localField: "deed_id",
  foreignField: "_id",
});
Log.schema.virtual("dispute", {
  ref: "Dispute",
  localField: "dispute_id",
  foreignField: "_id",
});

// Export Models and connection
module.exports = {
  mongoose,
  User,
  Deed,
  DeedMilestone,
  Dispute,
  WorkSubmission,
  Log,
  Faq,
  Suggestion,
};
