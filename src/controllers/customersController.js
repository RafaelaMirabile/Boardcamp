import connection from "../database/database.js";
import { STATUS_CODE } from "../enums/StatusCode.js";

export async function listCustomers(req,res){
    const {cpf} = req.query;
    try {
        if(cpf){
            const customersFiltered = await connection.query('SELECT * FROM customers WHERE cpf LIKE $1',[`${cpf}%`]);
            return res.status(STATUS_CODE.OK).send(customersFiltered.rows);            
        }        
        const customers = await connection.query('SELECT * FROM customers;');
        return res.status(STATUS_CODE.OK).send(customers.rows);
    
    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
    }
}

export async function fetchCustomer(req,res){
    const customerId = req.params.id;
    try {
        const customer = await connection.query('SELECT * FROM customers WHERE id = $1',[customerId]);        
        
        if(customer.rowCount === 0){
            return res.sendStatus(STATUS_CODE.NOT_FOUND);
        }
           return res.send(customer.rows[0]).status(STATUS_CODE.OK);
        
    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
    }
}

export async function createCustomer(req,res){
    const { name, phone, cpf, birthday } = req.body;
    
    try {
        const customers = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if (customers.rowCount === 1) {
            return res.sendStatus(400);
        }
        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)',[name, phone, cpf, birthday]);

        return res.sendStatus(STATUS_CODE.CREATED);

    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
        
    }
}

export async function updateCustomer(req,res){
    const { name, phone, cpf, birthday } = req.body;
    const customerId = req.params.id;

    try {
        const customers = await connection.query('SELECT * FROM customers WHERE cpf = $1 AND id <> $2', [
            cpf,
            customerId
        ]);

        if (customers.rowCount === 1) {
            return res.sendStatus(STATUS_CODE.CONFLICT);
        }

        await connection.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', [
            name,
            phone,
            cpf,
            birthday,
            customerId
        ]);
        return res.sendStatus(STATUS_CODE.CREATED);
        
    } catch (error) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR);
        console.log(error);
        
    }
}