import connection from "../database/database.js";
import { STATUS_CODE } from "../enums/StatusCode.js";
import gameSchema from "../models/games.js";

export default async function validateGame(req,res,next){
    const newGame = req.body;

    const joiValidation = gameSchema.validate(newGame,{abortEarly: false});

    if(joiValidation.error){
        return res.sendStatus(STATUS_CODE.BAD_REQUEST);
    }
    try {
        const categories = await connection.query('SELECT * FROM categories WHERE id=$1', [newGame.categoryId]);
        const games = await connection.query('SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1)', [newGame.name]);

        if(games.rowCount === 1 ){
            return res.sendStatus(STATUS_CODE.CONFLICT);
        }

        if(categories.rowCount === 0){
            return res.sendStatus(STATUS_CODE.BAD_REQUEST);
        }

        next();
        
    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
    }
}