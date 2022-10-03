import connection from "../database/database.js";
import { STATUS_CODE } from "../enums/StatusCode.js";
import dayjs from 'dayjs'

export async function listRentals(req,res){
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;

    try {
        const result = await connection.query('SELECT * FROM rentals');
        const customerInfo = await connection.query(`
        SELECT
            customers.id AS id,
            customers.name AS name
        FROM customers
        INNER JOIN rentals
        ON rentals."customerId" = customers.id
        `);
        const gameInfo = await connection.query(`
        SELECT
            games.id,
            games.name,
            games."categoryId",
            categories.name AS "categoryName"
        FROM games
        INNER JOIN categories
        ON categories.id = games."categoryId"
        `);

        if (result.rowCount === 0) {
          return res.send(result.rows);
        }

        result.rows = result.rows.map(rental => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: new Date(rental.rentDate).toLocaleDateString('en-CA'),
            daysRented: rental.daysRented,
            returnDate: rental.returnDate ? new Date(rental.returnDate).toLocaleDateString('en-CA') : null,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: customerInfo.rows.find(value => rental.customerId === value.id),
            game: gameInfo.rows.find(value => rental.gameId === value.id)
        }))
        if (customerId !== undefined && gameId !== undefined) {
            result.rows = result.rows.filter(value => value.customer.id === parseInt(customerId) && value.game.id === parseInt(gameId));
           return res.send(result.rows);
        }
        if (customerId !== undefined && gameId === undefined) {
            result.rows = result.rows.filter(value => value.customer.id === parseInt(customerId));
           return res.send(result.rows);
        }
        if (gameId !== undefined && customerId === undefined) {
            result.rows = result.rows.filter(value => value.game.id === parseInt(gameId));
           return res.send(result.rows);

        }
       return res.send(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
    }

}

export async function createRental(req,res){

    const {customerId,gameId,daysRented} = req.body;

    try {

        const customer = await connection.query('SELECT * FROM customers WHERE id = $1',[customerId]);
        
        if(customer.rowCount === 0){
            return res.sendStatus(STATUS_CODE.BAD_REQUEST);
        }
        const game = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);

        if (game.rowCount === 0) {
            return res.sendStatus(STATUS_CODE.BAD_REQUEST);
        }
        const rentals = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [
            gameId
        ]);

        if (rentals.rowCount === game.rows[0].stockTotal) {
            return res.sendStatus(STATUS_CODE.BAD_REQUEST);
        }

        const rentDate = dayjs().format('YYYY-MM-DD');
        const returnDate = null;
        const originalPrice = game.rows[0].pricePerDay * daysRented;
        const delayFee = null;
        
        await connection.query(
            'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
        );

       return res.sendStatus(STATUS_CODE.CREATED);

    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
    }
}

export async function returnRental(req,res){
    const rentalId = req.params.id;


    try {
        const rentalIdCheck = await connection.query('SELECT * FROM rentals WHERE id = $1', [rentalId]);
        
        if (rentalIdCheck.rowCount === 0) {
          return res.sendStatus(STATUS_CODE.NOT_FOUND);
        }

        const game = await connection.query('SELECT * FROM games WHERE id = $1', [rentalIdCheck.rows[0].gameId]);

        const devolutionInDays = new Date(rentalIdCheck.rows[0].rentDate).getTime() / (1000 * 60 * 60 * 24);
        const devolutionDate = new Date((devolutionInDays + rentalIdCheck.rows[0].daysRented) * (1000 * 60 * 60 * 24));
        const returnDate = new Date()

        const daysDiff = Math.floor(((returnDate.getTime() - devolutionDate.getTime()) / (1000 * 60 * 60 * 24)));
        const delayFee = daysDiff * game.rows[0].pricePerDay;

        await connection.query(`
        UPDATE rentals
        SET
            "returnDate" = $1,
            "delayFee" = $2
        WHERE id = $3
        `, [returnDate.toLocaleDateString('en-CA'), delayFee <= 0 ? 0 : delayFee, rentalId]);
       return res.sendStatus(STATUS_CODE.OK);
    } catch (error) {
        console.log(error);
       return res.sendStatus(STATUS_CODE.SERVER_ERROR);
    }
}

export async function deleteRental(req,res){
    
    const rentalId = req.params.id;

    try {
        const rentalIdCheck = await connection.query('SELECT * FROM rentals WHERE id = $1', [rentalId]);
        
        if (rentalIdCheck.rowCount === 0) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND);

        }
        await connection.query('DELETE FROM rentals WHERE id = $1', [rentalId]);
       return res.sendStatus(STATUS_CODE.OK);
    } catch (error) {
       console.log(error);
       return res.sendStatus(STATUS_CODE.SERVER_ERROR);
    }
}