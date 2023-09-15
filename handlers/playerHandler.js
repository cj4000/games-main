const Player = require("../pkg/casino/playerSchema");

// Get all players
exports.getAll = async (req, res) => {
  try {
    // Fetch all players from the database
    const allPlayers = await Player.find();

    res.status(200).json({
      status: "success",
      data: {
        allPlayers
      },
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Get paginated players
exports.getPaginated = async (req, res) => {
  try {
    // Parse query parameters for pagination (default page: 1, default limit: 2)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const skip = (page - 1) * limit;

    const allPaginatedPlayers = await Player.find()
      .skip(skip)
      .limit(limit);

    const totalPlayers = await Player.countDocuments();

    res.status(200).json({
      status: "success",
      data: {
        allPaginatedPlayers,
        totalPlayers,
        currentPage: page,
        totalPages: Math.ceil(totalPlayers / limit),
      },
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Get a single player by ID
exports.getOne = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        player,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Update a player's data
exports.update = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        player,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Delete a player by ID
exports.delete = async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Create a new player
exports.create = async (req, res) => {
  try {
    const newPlayer = await Player.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user: newPlayer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Search for players by first name or last name (case-insensitive)
exports.search = async (req, res) => {
  try {
    // Extract the search query from query parameters
    const searchQuery = req.query.query;

    // Use a regular expression to search for players by first name or last name
    const searchResults = await Player.find({
      $or: [
        { firstName: { $regex: new RegExp(searchQuery, "i") } },
        { lastName: { $regex: new RegExp(searchQuery, "i") } },
      ],
    });

    res.status(200).json({
      status: "success",
      data: {
        searchResults,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while searching for players.",
    });
  }
};
