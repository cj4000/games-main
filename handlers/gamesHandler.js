const Games = require("../pkg/casino/gamesSchema");
const Player = require("../pkg/casino/playerSchema")

const multer = require("multer");
const uuid = require("uuid");

const imageId = uuid.v4();

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "pkg/img");
  },
  filename: (req, file, callback) => {
    const type = file.mimetype.split("/")[1];
    callback(null, `game-${imageId}-${Date.now()}.${type}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("File not supported"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

exports.uploadGamePhoto = upload.array("image", 5);

exports.getAll = async (req, res) => {
  try {
    const allGames = await Games.find();

    res.status(200).json({
      status: "success",
      data: {
        allGames,
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

    const allPaginatedGames = await Games.find()
      .skip(skip)
      .limit(limit);

    const totalGames = await Games.countDocuments();


    res.status(200).json({
      status: "success",
      data: {
        allPaginatedGames,
        totalGames,
        currentPage: page,
        totalPages: Math.ceil(totalGames / limit),
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
    const game = await Games.findById(req.params.id).populate(
      "players"
    );

    res.status(200).json({
      status: "success",
      data: {
        game,
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
    const gameId = req.params.id;
    const updateData = req.body;

    const imageFiles = req.files;
    if (imageFiles && imageFiles.length > 0) {
      const imageFileNames = imageFiles.map((file) => file.filename);
      updateData.image = imageFileNames;
    }

    const updatedGame = await Games.findByIdAndUpdate(gameId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedGame) {
      return res.status(404).json({
        status: "fail",
        message: "Game not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        game: updatedGame,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the game.",
    });
  }
};



exports.delete = async (req, res) => {
  try {
    await Games.findByIdAndDelete(req.params.id);

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

    console.log("req.file:", req.file); 
    console.log("req.body:", req.body)

    const imageFiles = req.files;
    const imageFileNames = imageFiles.map((file) => file.filename);

    const newGame = await Games.create({
      title: req.body.title,
      description: req.body.description,
      image: imageFileNames,
    });
    res.status(201).json({
      status: "success",
      data: {
        Games: newGame,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.search = async (req, res) => {
  try {
    const searchQuery = req.query.query; 
    console.log("Search Query:", searchQuery);

    const searchResults = await Games.find({
      title: { $regex: new RegExp(searchQuery, "i") },
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
      message: "An error occurred while searching for games.",
    });
  }
};

exports.listGamesPlayedByPlayer = async (req, res) => {
  try {
    const playerId = req.params.playerId; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({
        status: "fail",
        message: "Player not found",
      });
    }

    const games = await Games.find({ _id: { $in: player.games } })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: "success",
      data: {
        games,
        currentPage: page,
        totalPages: Math.ceil(player.games.length / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching games played by the player.",
    });
  }
};