const { Deed, User, DeedMilestone } = require("../models");
const mongoose = require("mongoose");
// const { Op } = require("sequelize");

// Create a deed
// [HTTP POST]
exports.createDeed = async (req, res) => {
  try {
    const {
      job_count,
      title,
      description,
      payment_method,
      payment_type,
      amount,
      timeline,
      user_id,
      buy_sell_type,
      category,
      milestones,
    } = req.body;

    const deed = await Deed.create({
      job_count,
      title,
      description,
      payment_method,
      payment_type,
      amount,
      timeline,
      seller_id:
        buy_sell_type === "SELL"
          ? new mongoose.Types.ObjectId(`${user_id}`)
          : null,
      buyer_id:
        buy_sell_type === "BUY"
          ? new mongoose.Types.ObjectId(`${user_id}`)
          : null,
      status: "pending", // Default status for new deeds
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (payment_type === "milestone") {
      for (const milestone of milestones) {
        await DeedMilestone.create({
          name: milestone.milestone,
          amount: parseFloat(milestone.amount),
          timeline: parseInt(milestone.timeline),
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
          deed_id: deed._id, // deed_id is correctly an ObjectId now
        });
      }
    }

    res.status(201).json(deed);
  } catch (error) {
    console.log(">>> error : ", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all deeds
// [HTTP GET]
exports.getAllDeeds = async (req, res) => {
  try {
    console.log('hi')
    const deeds = await Deed.find(); // Ensure this fetches data as expected
    console.log("Fetched deeds:", deeds); // Debugging
    return res.status(200).json(deeds);
  } catch (error) {
    console.error("Error fetching deeds:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get a deed by ID
// [HTTP GET]
//http://localhost:3001/deed/userId
exports.getDeedById = async (req, res) => {
  try {
    const deedId = req.params.id;
    const deed = await Deed.findOne({
      _id: deedId,
    }).populate("milestones");

    if (!deed) {
      return res.status(404).json({ message: "Deed not found" });
    }
    return res.status(200).json(deed);
  } catch (error) {
    console.error("Error fetching deed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a deed by userId
// [HTTP GET]
//http://localhost:3001/deed/byuser/deedId
exports.getDeedByUserId = async (req, res) => {
  try {
    console.log("hi");

    const userId = req.params.id;
    console.log(userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const deeds = await Deed.find({
      $or: [
        { buyer_id: userId },
        { seller_id: userId },
      ],
    }).populate("milestones"); // Ensure the `milestones` field is populated

    if (!deeds.length) {
      console.log("helloo");
      return res.status(404).json({ message: "No deeds found" });
    }

    res.status(200).json(deeds);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update a deed
// [HTTP PATCH]
// http://localhost:3001/deed/deedId/update
exports.updateDeed = async (req, res) => {
  try {
    const deedId = req.params.id;
    console.log('>>>deedId', deedId)

    const deed = await Deed.findById(deedId).populate("milestones");
    if (!deed) {
      return res.status(404).json({ message: "Deed not found" });
    }

    let milestoneIds = [];
    if (req.body.milestones && Array.isArray(req.body.milestones)) {
      const existingMilestonesMap = new Map(
        deed.milestones.map((m) => [
          JSON.stringify({
            name: m.name,
            amount: m.amount.toString(),
            timeline: m.timeline,
          }),
          m,
        ])
      );

      const milestonePromises = req.body.milestones.map(
        async (incomingMilestone) => {
          const milestoneKey = JSON.stringify({
            name: incomingMilestone.milestone,
            amount: incomingMilestone.amount.toString(),
            timeline: incomingMilestone.timeline,
          });

          const existingMilestone = existingMilestonesMap.get(milestoneKey);

          if (existingMilestone) {
            return existingMilestone._id;
          } else {
            const similarNameMilestone = deed.milestones.find(
              (m) => m.name === incomingMilestone.milestone
            );

            if (similarNameMilestone) {
              similarNameMilestone.amount = incomingMilestone.amount;
              similarNameMilestone.timeline = incomingMilestone.timeline;
              await similarNameMilestone.save();
              return similarNameMilestone._id;
            } else {
              const newMilestone = new DeedMilestone({
                deed_id: deedId,
                name: incomingMilestone.milestone,
                amount: incomingMilestone.amount,
                timeline: incomingMilestone.timeline,
                status: "pending",
              });
              await newMilestone.save();
              return newMilestone._id;
            }
          }
        }
      );

      milestoneIds = await Promise.all(milestonePromises);

      delete req.body.milestones;
    }

    const updateData = { ...req.body };

    if (milestoneIds.length > 0) {
      updateData.milestones = milestoneIds;
    }

    // Update the deed
    const updatedDeed = await Deed.findByIdAndUpdate(deedId, updateData, {
      new: true,
      runValidators: true,
    }).populate("milestones");

    return res.status(200).json({
      message: "Deed updated successfully",
      deed: updatedDeed,
    });
  } catch (error) {
    console.error("Error updating deed:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// In case of buyer, to check its state
// [HTTP POST]
// http://localhost:3001/deed/requestFundsBefore
exports.requestFundsBefore = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;

    if (!user_id || !deed_id) {
      return res
        .status(400)
        .json({ error: "User ID and Deed ID are required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deed = await Deed.findById(deed_id).populate("milestones");
    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    if (!deed.buyer_id) {
      if (deed.seller_id === user_id) {
        return res.status(403).json({
          error: "Seller cannot become the buyer",
        });
      }
    }

    if (deed.buyer_id && deed.buyer_id !== user_id) {
      return res.status(403).json({
        error:
          "A buyer has already been assigned to this deed. Cannot change buyer.",
      });
    }

    // Check if the caller is the buyer
    if (deed.buyer_id && user_id !== deed.buyer_id) {
      return res
        .status(403)
        .json({ error: "Only the buyer can request funds." });
    }

    if (milestone_id) {
      // Find the milestone and ensure it belongs to this deed
      const milestone = await DeedMilestone.findOne({
        _id: milestone_id,
        deed_id: deed_id,
      });

      if (!milestone) {
        return res
          .status(404)
          .json({ error: "Milestone not found for this deed." });
      }

      // Check if the milestone status allows requesting funds
      if (milestone.status !== "pending") {
        return res.status(400).json({
          error:
            "Funds have already been requested or released for this milestone.",
        });
      }
      return res.json({
        message: "Funds requested successfully for the milestone.",
        milestone,
        deed,
      });
    } else {
      res.json({ message: "Complete payment requested successfully.", deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// In case of buyer, to save its updated state
// [HTTP POST]
// http://localhost:3001/deed/requestFundsAfter
exports.requestFundsAfter = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;

    if (!user_id || !deed_id) {
      return res
        .status(400)
        .json({ error: "User ID and Deed ID are required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deed = await Deed.findById(deed_id).populate("milestones");

    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    if (!deed.buyer_id) {
      if (deed.seller_id === user_id) {
        return res.status(403).json({
          error: "Seller cannot become the buyer",
        });
      }
    }

    // Check if the caller is the buyer
    if (deed.buyer_id && user_id !== deed.buyer_id) {
      return res
        .status(403)
        .json({ error: "Only the buyer can request funds." });
    }

    if (milestone_id) {
      // Check if the milestone exists
      const milestone = await DeedMilestone.findOne({
        _id: milestone_id,
        deed_id: deed_id,
      });

      if (!milestone) {
        return res
          .status(404)
          .json({ error: "Milestone not found for this deed." });
      }

      // Check if the milestone status allows requesting funds
      if (milestone.status !== "pending") {
        return res.status(400).json({
          error:
            "Funds have already been requested or released for this milestone.",
        });
      }

      // Change milestone status to "requested"
      milestone.status = "in_progress";
      await milestone.save();
      res.json({
        message: "Funds requested successfully for the milestone.",
        milestone,
      });
    } else {
      // Release complete payment
      deed.status = "completed"; // Change deed status to completed
      await deed.save();
      res.json({ message: "Complete payment requested successfully.", deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// In case of Seller, to check its state
// [HTTP POST]
//http://localhost:3001/deed/releaseFundsBefore
exports.releaseFundsBefore = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;
    if (!user_id || !deed_id) {
      return res
        .status(400)
        .json({ error: "User ID and Deed ID are required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deed = await Deed.findById(deed_id).populate("milestones");

    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    if (!deed.buyer_id) {
      if (deed.seller_id === user_id) {
        return res.status(403).json({
          error: "Seller cannot become the buyer",
        });
      }
    }

    // Check if the caller is the buyer
    if (deed.buyer_id && user_id !== deed.buyer_id) {
      return res
        .status(403)
        .json({ error: "Only the buyer can request funds." });
    }

    if (milestone_id) {
      // Release funds for a specific milestone
      const milestone = await DeedMilestone.findOne({
        _id: milestone_id,
        deed_id: deed_id,
      });

      if (!milestone) {
        return res
          .status(404)
          .json({ error: "Milestone not found for this deed." });
      }

      // Check if the funds have been requested for this milestone
      if (milestone.status !== "in_progress") {
        return res
          .status(400)
          .json({ error: "Funds are not in progress for this milestone." });
      }

      milestone.status = "requested";
      await milestone.save();

      res.json({
        message: "Milestone funds released successfully.",
        milestone,
      });
    } else {
      res.json({ message: "Complete payment released successfully.", deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// In case of Seller, to save updated the state
// [HTTP POST]
//http://localhost:3001/deed/releaseFundsAfter
exports.releaseFundsAfter = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;

    if (!user_id || !deed_id) {
      return res
        .status(404)
        .json({ error: "User ID and Deed ID are required" });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const deed = await Deed.findById(deed_id).populate("milestones");

    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    if (!deed.buyer_id) {
      if (deed.seller_id === user_id) {
        return res.status(403).json({
          error: "Seller cannot become the buyer",
        });
      }
    }

    // Check if the caller is the buyer
    if (deed.buyer_id && user_id !== deed.buyer_id) {
      return res
        .status(403)
        .json({ error: "Only the buyer can request funds." });
    }

    if (milestone_id) {
      // Find the milestone and ensure it belongs to this deed
      const milestone = await DeedMilestone.findOne({
        _id: milestone_id,
        deed_id: deed_id,
      });

      if (!milestone) {
        return res
          .status(404)
          .json({ error: "Milestone not found for this deed." });
      }

      // Check if the funds have been requested for this milestone
      if (milestone.status !== "requested") {
        return res
          .status(400)
          .json({ error: "Funds have not been requested for this milestone." });
      }

      // Change milestone status to "released"
      milestone.status = "completed";
      await milestone.save();

      res.json({
        message: "Milestone funds released successfully.",
        milestone,
      });
    } else {
      // Release complete payment
      deed.status = "completed"; // Change deed status to completed
      await deed.save();
      res.json({ message: "Complete payment released successfully.", deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP GET]
//http://localhost:3001/deed/deed_id/milestones
exports.getMilestonesByDeedId = async (req, res) => {
  try {
    const { deed_id } = req.params;

    if (!deed_id) {
      return res.status(400).json({ error: "You must provide deed id" });
    }

    // Find the deed to ensure it exists
    const deed = await Deed.findById(deed_id).populate("milestones");

    if (!deed) {
      return res.status(404).json({ error: "Deed not found" });
    }

    // Retrieve milestones associated with the deed
    const milestones = await DeedMilestone.find({
      deed_id: deed_id,
    });

    // If there are no milestones, return a message
    if (milestones.length === 0) {
      return res
        .status(404)
        .json({ message: "No milestones found for this deed." });
    }

    res.json(milestones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//[HTTP PATCH]
// http://localhost:3001/deed/milestones/update/milestone_id
exports.updateMilestoneByMilestoneId = async (req, res) => {
  try {
    const { milestone_id } = req.params;
    const { milestone_name, amount, timeline, status } = req.body;

    // Find the milestone to ensure it exists
    const milestone = await DeedMilestone.findOne({
      _id: milestone_id,
    });

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    // Update milestone details
    if (milestone_name) milestone.name = milestone_name;
    if (amount) milestone.amount = amount;
    if (timeline) milestone.timeline = timeline;
    if (status) milestone.status = status;

    await milestone.save();

    res.json({ message: "Milestone updated successfully.", milestone });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
