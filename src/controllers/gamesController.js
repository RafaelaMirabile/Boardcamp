import connection from "../database/database.js";
import { STATUS_CODE } from "../enums/StatusCode.js";

export async function listGames(req,res){
    try {
        const games = await connection.query('SELECT * FROM games;');
        
        return res.status(STATUS_CODE.CREATED).send(games.rows);

    } catch (error) {
       res.sendStatus(STATUS_CODE.SERVER_ERROR);
       console.log(error);
    }
}

export async function createGame(req,res){
    
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    
    try {
        await  connection.query(
            'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        return res.status(STATUS_CODE.CREATED);

    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
    }

}
