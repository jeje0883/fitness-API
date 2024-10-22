const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
//require('./passport')
require('dotenv').config();
const http = require('http'); // get http
const { startCronJob} = require('./utility/cronJob');

//define env config
port = process.env.PORT || 3000;
mongodb = process.env.MONGODB_STRING;
secret = process.env.clientSecret;



//setup middleware
const corsOptions = {
    origin: ['http://localhost:3000', 'http://zuitt-bootcamp-prod-460-7841-descalsota.s3-website.us-east-1.amazonaws.com'], 
    credentials: true, 
    optionsSuccessStatus: 200 
};


//connect to MONGODB
mongoose.connect(mongodb);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));


//setup the server

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors(corsOptions));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// define routes

const userRoutes = require("./routes/userRoute");
const workoutRoutes = require("./routes/workoutRoute");



// setup routes
// app.use("/b2/cart", cartRoutes);
// app.use("/b2/orders", orderRoutes);
// app.use("/b2/products", productRoutes);
// app.use("/b2/users", userRoutes);


// setup routes

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);



app.get('/', (req, res) => {
    res.send('Server is up and running');
})


// initialize the server
if(require.main === module){
	app.listen(port, () => {
		console.log(`API is now online on port ${ port }`)
	});

    startCronJob('https://fitnessapi-d8z8.onrender.com');
}

module.exports = {app, mongoose};