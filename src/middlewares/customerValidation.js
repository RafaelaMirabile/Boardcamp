import connection from "../database/database.js";
import { STATUS_CODE } from "../enums/StatusCode.js";
import custumerSchema from "../models/customer.js";

export async function validateCustomer(req,res,next){
    const newCustomer = req.body;

    const joiValidation = custumerSchema.validate(newCustomer,{abortEarly: false});
    
    if(joiValidation.error){
        console.log(joiValidation.error);
       return res.sendStatus(STATUS_CODE.BAD_REQUEST);
    }
        next();
}