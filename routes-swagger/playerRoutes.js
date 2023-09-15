const express = require('express');
const router = express.Router();
const playerHandler = require('../handlers/playerHandler');


// List all players
/**
 * @swagger
 *  /players:
 *   get:
 *     summary: Get a list of all players
 *     description: Retrieve a list of all casino players.
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */


router.get('/players', playerHandler.getAll);


module.exports = router;