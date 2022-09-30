import connection from "../database/database.js";
import { STATUS_CODE } from "../enums/StatusCode.js";
import categorySchema from "../models/categories.js";

export default async function validateCategory(req,res,next){
    const newCategory = req.body;

    const joiValidation = categorySchema.validate(newCategory, {abortEarly: false});

    if(joiValidation.error){
        return res.sendStatus(STATUS_CODE.BAD_REQUEST);
    }
    try {
        const categories = await connection.query('SELECT * FROM categories WHERE name=$1',[newCategory.name]);

        if(categories.rowCount === 1 ){
            return res.sendStatus(STATUS_CODE.CONFLICT);
        }
        next();
    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
    }
}