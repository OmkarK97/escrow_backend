const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Deed } = require("../models");

// [HTTP POST]
exports.register = async (req, res) => {
  console.log(`>>> ${req.body.first_name}`);
  const { first_name, last_name, email, password } = req.body;
  try {
    console.log(`>>> ${first_name} ${last_name} ${email}, ${password}`);
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP POST]
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.isActive === false) {
      return res.status(401).json({ error: "User is deactivated" });
    }
    // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [HTTP GET]
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [HTTP PATCH]
exports.updateUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const { first_name, last_name, password } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.updateOne({
      first_name,
      last_name,
      password,
    });

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    return res
      .status(200)
      .json({ message: "User details updated successfully", user });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [HTTP GET]
exports.getUserActivity = async (req, res) => {
  try {
    const userId = req.params.userId;

    const activity = await Deed.aggregate([
      { $match: { seller_id: userId } },
      {
        $group: {
          _id: null,
          totalDeeds: { $sum: 1 }, // Count total deeds
          totalMoney: { $sum: "$amount" }, // Sum of the "amount" field
          activeDeeds: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "pending"] },
                    { $eq: ["$status", "in_progress"] },
                  ],
                },
                1,
                0,
              ],
            },
          }, // Count deeds with status "pending" or "in_progress"
          completedDeeds: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          }, // Count deeds with status "completed"
        },
      },
    ]);

    console.log(activity);

    const activityData = activity[0] || {
      totalDeeds: 0,
      totalMoney: 0,
      activeDeeds: 0,
      completedDeeds: 0,
    };

    res.json(activityData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP GET]
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
