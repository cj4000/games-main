const express = require('express');
const router = express.Router();
const gamesHandler = require('../handlers/gamesHandler');


// List all games
/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get a list of all games
 *     description: Retrieve a list of all casino games.
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

router.get('/games', gamesHandler.getAll);


// Get one game by ID
/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get a game by ID
 *     description: Retrieve a game by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the game to retrieve
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Game not found
 */
router.get('/game/:id', gamesHandler.getOne);


module.exports = router;