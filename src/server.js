import express from 'express'
import cors from'cors'
import dotenv from 'dotenv'
import categoriesRouter from '../src/routes/categoriesRouter.js'

dotenv.config();

const server = express();

server.use(express.json());
server.use(cors());

server.use('/',categoriesRouter);

server.listen(process.env.PORT , ()=>{
     console.log(`Server listening on port ${process.env.PORT}`)
})
