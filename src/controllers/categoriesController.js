import { STATUS_CODE } from '../enums/StatusCode.js'
import connection from '../database/database.js'

export async function listCategories(req,res){
    try {
        const categories = await connection.query('SELECT * FROM categories;');
        res.status(STATUS_CODE.OK).send(categories.rows);       
    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);       
    }
}

export async function createCategory(req,res){
    const name = req.body.name;
    try {
        await connection.query('INSERT INTO categories (name) VALUES ($1)',[name]);
        res.status(STATUS_CODE.CREATED);
    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
    }
}
