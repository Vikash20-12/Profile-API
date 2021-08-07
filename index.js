const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./controllers/authorization');


dotenv.config({path:'./config/config.env'});

//Connecting to database
const connectDB =  async (req, res)=>{
    const conn = await mongoose.connect(process.env.DB_CONNECT, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false,
        useCreateIndex:true
    });
    try {
        console.log(`mongoDB connected to ${conn.connection.host}`)
    } catch (error) {
        res.status(400).send(error);
    }
}

connectDB();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//route middleware
app.use('/api',authRoute);

//server and PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server up and running on https://localhost:${PORT}`);
});