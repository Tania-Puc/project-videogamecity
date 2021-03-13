const { Router } = require('express');
const express=require ('express');
const { route } = require('.');
const router=express.Router();

const passport=require('passport');
const {isLoggedIn,isNotLoggedin}=require('../lib/auth');

router.get('/singup', isNotLoggedin,(req,res)=>{
    res.render('auth/singup');
})

router.post('/singup', isNotLoggedin,passport.authenticate('local.singup',{ successRedirect: '/signin',
 failureRedirect: '/singup',
 failureFlash: true

}));

router.get('/signin',isNotLoggedin,(req,res)=>{
    res.render('auth/signin');
});


router.post('/signin', isNotLoggedin, (req,res, next)=>{
     passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failWithError: '/signin',
        failureFlash: true
    })(req,res, next);
});


router.get('/profile', isLoggedIn, (req,res)=>{
    res.render('profile');
})

router.get('/logout',(req,res)=>{
    req.logOut();//Metodo de passaport para limpiar (cerrar) la sesión del usuario
    res.redirect('/signin');

});

module.exports=router;