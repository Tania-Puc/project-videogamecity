const morgan =require("morgan");

const express=require('express');

const exphbs=require('express-handlebars');

const path=require('path');

const flash=require('connect-flash');

const session=require('express-session');

const MySQLStore = require('express-mysql-session');

const passport= require('passport');

const {database}=require('./keys');

//INITIALIZATIONS
const app=express();
require('./lib/passport');

//SETTINGS
app.set('port',process.env.PORT || 4000);

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars') 
}))
app.set('view engine', '.hbs');


//MIDLEWEARS
app.use(session({
    secret: 'tania',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
}));

app.use(flash());

app.use(morgan('dev'));

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use(passport.initialize());

app.use(passport.session());


//GLOBAL VARIABLES

app.use((req,res,next)=>{
    app.locals.correcto=req.flash('correcto');
    app.locals.error=req.flash('error');
    app.locals.admin=req.flash('admin');

    app.locals.user=req.user;
    next();
});


//ROUTES
app.use(require ('./routes'));
app.use(require ('./routes/authentication'));
app.use('/juegos',require ('./routes/juegos'));

app.use(function (req, res) {
	res.status(404);
	res.render('pages/404');
});


app.use(function (err, req, res) {
    res.status(500);
    res.render('pages/error', { error: err });
  });

//PUBLIC

app.use(express.static(path.join(__dirname, 'public')));

//STARTING THE SERVER

app.listen(app.get('port'),()=>{
    console.log('SERVER ON PORT',app.get('port'));
});