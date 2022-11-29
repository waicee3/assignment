const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const config = require('./config/config');
const path = require('path');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const ejs = require('ejs');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const middleware = require('./config/globals');

//configuring database
mongoose.connect(config.database,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
});

//checkin/listening db connection
let db = mongoose.connection;
db.once('open',()=>{
    console.log('connected to mongodb')
});
db.on('error',(e)=>{
    console.log(e)
});
//app initialization
const app = express();
const server = http.createServer(app);
app.set('port',2022);

//configuring bodyparser
app.use(bodyParser.urlencoded({
    extended:false,
    }));
app.use(cookieParser('secreteString'));
app.use(session({
    secret : 'secreteString',
    saveUninitialized : true,
    resave : true,
}))

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());

//view engine
app.set('views',path.join(__dirname,'/pages'));
app.set('view engine','ejs');
app.engine(
    'ejs',
    ejs.renderFile
);
app.use(layouts);
app.set('layout','layout');

//express validator
app.use(express.json());

app.use(express.static(path.join(__dirname,'./chibaya')));
app.use(middleware.globalLocals);
app.use(middleware.flashMessage);

const web = require('./controllers/web');
//
app.use('/',web);

//
server.listen(app.get('port'),()=>{
    console.log(`express server listening on port ${app.get('port')
    }`)
});