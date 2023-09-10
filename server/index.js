const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userRouter = require('./api/users/user.router');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/cors_options');
const { connect } = require('./config/database');
const path = require('path');

dotenv.config({ path: './.env'});

connect();

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false}));

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public', 'assets')));

app.use(express.static(path.join(__dirname, 'files')));

app.use('/api/users', userRouter);

app.listen(process.env.APP_PORT,()=>{
    console.log(`Server up and running on port: ${process.env.APP_PORT}`);
})