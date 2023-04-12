require('dotenv').config();

const express =require('express');
const mongoose = require('mongoose');

const auth=require('./middleware/auth');
const errors=require('./middleware/errors');
const {unless} = require('express-unless');
const app = express();
const userRoute = require('./routes/userroute');
const clientsroute = require('./routes/client')
const adminsroute = require('./routes/admin')
const translatorsroute = require('./routes/translator')
mongoose.promise = global.Promise;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
 .then( () => {  
 app.listen(process.env.port, () => console.log(`connected to mongoDB and app listening on port ${process.env.port}`))
 },
    (err) => { console.log(err) }

   )



auth.authenticatetoken.unless= unless;
app.use(
  auth.authenticatetoken.unless({
    path: [
        { url: '/api/user/login', methods: ['POST'] },
        { url: '/api/user/register', methods: ['POST'] },
    ],
    })
)


app.use('/api/user',userRoute);
app.use(errors.errorHandler)
app.use('/api/client', clientsroute)
app.use('/api/admin', adminsroute)
app.use('/api/translator', translatorsroute)