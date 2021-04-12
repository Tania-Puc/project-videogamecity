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
});

//mostrar tabla de juegos 
router.get('/aprobarjuegos',isLoggedIn, async(req, res)=>{
    const videojuegos3= await pool.query('SELECT idjuego,idestatus,titulo, descripcion, imagen, puntos,usuario.nombre, CONVERT_TZ( create_at, "Africa/Timbuktu","America/Mexico_City" )as create_at FROM videojuegos INNER JOIN usuario ON videojuegos.idusuario = usuario.idusuario where videojuegos.idestatus=1',);
    res.render('admin/aprobar',{videojuegos3});    
});

//eliminar videojuegos por parte del administrador
router.get('/deletejuegos/:idjuego',isLoggedIn, async(req, res)=>{
    const {idjuego}=req.params;
    await pool.query('DELETE FROM `videojuegos` WHERE `videojuegos`.`idjuego` = ? ',[idjuego]);
    req.flash('correcto','EL VIDEOJUEGO HA SIDO ELIMINADO')
    res.redirect('/admin/aprobarjuegos');
});


router.get('/aprobar/:idjuego',isLoggedIn,async(req,res)=>{
    const {idjuego}=req.params;
    const videojuegos=await pool.query('SELECT idjuego,idestatus,titulo, descripcion, imagen, puntos,usuario.idusuario,usuario.nombre, CONVERT_TZ( create_at, "Africa/Timbuktu","America/Mexico_City" ) \
    AS create_at  \
    FROM videojuegos \
    INNER JOIN usuario \
    ON videojuegos.idusuario = usuario.idusuario \ WHERE idjuego=?',[idjuego]); 
    console.log(videojuegos[0]);
    res.render('admin/edit',{videojuegos:videojuegos[0]});
});

router.post('/aprobar/:idjuego',isLoggedIn, async (req,res)=>{
    const{idjuego}=req.params;
    const{titulo,descripcion,imagen,idestatus,idusuario}=req.body;
    const juegoedit={
        titulo,
        descripcion,
        imagen,
        idestatus,
        idusuario
    };
    console.log(juegoedit);
    await pool.query('update videojuegos set ? where idjuego= ?' ,[juegoedit,idjuego]);
    req.flash('correcto','EL VIDEOJUEGO HA SIDO APROBADO')
    res.redirect('/admin/aprobarjuegos');
});



module.exports=router;