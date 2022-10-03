import { STATUS_CODE } from "../enums/StatusCode.js";
import rentalSchema from "../models/rental.js";

export async function validateRentals(req,res,next){
    
    const newRental = req.body;
    
    const joiValidation = rentalSchema.validate(newRental,{abortEarly: false});

    if(joiValidation.error){
       return res.sendStatus(STATUS_CODE.BAD_REQUEST);
    }
    try {
        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS_CODE.SERVER_ERROR);
    }
}