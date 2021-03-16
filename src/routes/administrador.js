const { compare } = require('bcryptjs');
const { request, Router, response } = require('express');
const express=require ('express');
const { route } = require('.');
const router=express.Router();

//refferencia a la base de datos
const pool=require('../database');
const {isLoggedIn}=require('../lib/auth');



router.get('/admin', (req,res)=>{
    res.render('admin');
})

router.get('/aprobarjuegos', (req,res)=>{
    res.render('admin/aprobar');
})
module.exports=router;