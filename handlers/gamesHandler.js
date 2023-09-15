const Games = require("../pkg/casino/gamesSchema");
const Player = require("../pkg/casino/playerSchema")

const multer = require("multer");
const uuid = require("uuid");

// Generate a unique image ID using UUID
const imageId = uuid.v4();

// Configure Multer storage for file uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Define the filename for uploaded images based on the file type and unique ID
    callback(null, "pkg/img");
  },
  filename: (req, file, callback) => {
    // Define the filename for uploaded images based on the file type and unique ID
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

// Configure Multer with defined storage and filter
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
  },
});

// Middleware for handling file uploads
exports.uploadGamePhoto = upload.array("image", 5);

// Get all games
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
    // Parse query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const skip = (page - 1) * limit;

    // Retrieve paginated games and calculate total game count
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

// Get a single game by ID
exports.getOne = async (req, res) => {
  try {
    const game = await Games.findById(req.params.id);

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

// Update a game
exports.update = async (req, res) => {
  try {
    const gameId = req.params.id;
    const updateData = req.body;

    // Handle image file uploads
    const imageFiles = req.files;
    if (imageFiles && imageFiles.length > 0) {
      const imageFileNames = imageFiles.map((file) => file.filename);
      updateData.image = imageFileNames;
    }

    // Update the game data in the database
    const updatedGame = await Games.findByIdAndUpdate(gameId, updateData, {
      new: true,
      runValidators: true,
    });

    // Check if the game was found
    if (!updatedGame) {
      return res.status(404).json({
        status: "fail",
        message: "Game not found",
      });
    }

    // Return the updated game data
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

// Delete a game
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

// Create a new game
exports.create = async (req, res) => {
  try {
    console.log("req.file:", req.file); 
    console.log("req.body:", req.body)
   
    // Handle image file uploads
    const imageFiles = req.files;
    const imageFileNames = imageFiles.map((file) => file.filename);
    
    // Create a new game with the provided data
    const newGame = await Games.create({
      title: req.body.title,
      description: req.body.description,
      image: imageFileNames,
    });

    // Return the newly created game data
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

// Search for games by title or other attributes
exports.search = async (req, res) => {
  try {
    // Extract the search query from query parameters
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