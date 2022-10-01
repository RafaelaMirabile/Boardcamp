import express from 'express'
import { createGame, listGames } from '../controllers/gamesController.js';
import validateGame from '../middlewares/gameValidation.js';

const router = express.Router();

router.get('/games',listGames);
router.post('/games',validateGame,createGame);

export default router;
