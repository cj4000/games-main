const Player = require("../pkg/casino/playerSchema");

exports.getAll = async (req, res) => {
  try {
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

exports.getPaginated = async (req, res) => {
  try {
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

exports.search = async (req, res) => {
  try {
    const searchQuery = req.query.query;

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
