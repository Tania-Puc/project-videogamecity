const { compare } = require('bcryptjs');
const { request, Router, response } = require('express');
const express=require ('express');
const { route } = require('.');
const router=express.Router();

//refferencia a la base de datos
const pool=require('../database');
const {isLoggedIn}=require('../lib/auth');

//RUTA PARA AGREAGAR VIDEOJUEGOS
router.get('/add',isLoggedIn,(req, res)=>{
    res.render('juegos/add');
});
router.get('/aprobar',isLoggedIn,(req, res)=>{
    res.render('juegos/aprobar');
});
/*AL AGREGAR UN VIDEOJUEGO SE AGREGAR CON EL ESTATUS 2= NO APROBADO PARA POSTERIORMENTE 
EL ADMINISTRADOR LO APROBARA */
router.post('/add',isLoggedIn, async (req, res)=>{
    //console.log(req.body);

    const{titulo, descripcion, imagen,idestatus=1,puntos=1}=req.body;
    const newjuego={        
        titulo,    
        descripcion,
        imagen,
        puntos,
        idestatus,
        idusuario: req.user.idusuario
    };
    var titulo1=newjuego.titulo;
    titulo1 = titulo1.toLowerCase();

    const juegos= await pool.query('select*from videojuegos where titulo=?',[titulo1]);
    const juegoexis=juegos[0];

    if(juegos.length==1){

    const titulo=juegoexis.titulo;
   const updatejuego={
       descripcion:juegoexis.descripcion,
       puntos:juegoexis.puntos+1,
       idestatus:juegoexis.idestatus,
       idusuario:juegoexis.idusuario,
       idjuego:juegoexis.idjuego

   }

   await pool.query('update videojuegos set ? where titulo= ?' ,[updatejuego,titulo]);


    req.flash('correcto','EL VIDEOJUEGO YA HA SIDO REGISTRADO SE SUMARA TU RECOMENDACIÓN');
        res.redirect('/juegos')

    
    }else{
        await pool.query('INSERT INTO videojuegos set ?',[newjuego]);
        req.flash('correcto','VIDEOJUEGO AGREGADO CORRECTAMENTE, SE HA ENVIADO PARA SU REVISIÓN ');
        res.redirect('/juegos')

    
    }
  


});
//LISTAR LOS todos los VIDEOJUEGOS AGREGADOS
router.get('/',isLoggedIn, async(req, res)=>{
    const videojuegos= await pool.query('SELECT idjuego,idestatus,titulo, descripcion, imagen, puntos,usuario.nombre, CONVERT_TZ( create_at, "Africa/Timbuktu","America/Mexico_City" )as create_at FROM videojuegos INNER JOIN usuario ON videojuegos.idusuario = usuario.idusuario where usuario.idusuario=? and videojuegos.idestatus=2',[req.user.idusuario]);
    //console.log(videojuegos);
    res.render('juegos/list',{videojuegos});

});

router.get('/allgames',isLoggedIn, async(req, res)=>{
    const videojuegos2= await pool.query('SELECT idjuego,idestatus,titulo, descripcion, imagen, puntos,usuario.nombre, CONVERT_TZ( create_at, "Africa/Timbuktu","America/Mexico_City" )as create_at FROM videojuegos INNER JOIN usuario ON videojuegos.idusuario = usuario.idusuario where videojuegos.idestatus=2' ,);
    //console.log(videojuegos2);
    res.render('juegos/allgames',{videojuegos2});

});


//ELIMINAR VIDEOJUEGOS
router.get('/delete/:idjuego',isLoggedIn, async(req, res)=>{
    const {idjuego}=req.params;
    await pool.query('DELETE FROM `videojuegos` WHERE `videojuegos`.`idjuego` = ? ',[idjuego]);
    req.flash('correcto','ELIMINADO CORRECTAMENTE')
    res.redirect('/juegos');
});
//EDITAR JUEGOS REGISTRADOS

//ENVIAR ID DEL VIDEOJUEGO A UN FORMULARIO PARA EDITAR SUS DATOS
router.get('/edit/:idjuego',isLoggedIn,async(req,res)=>{
    const {idjuego}=req.params;
    const videojuegos=await pool.query('SELECT * FROM `videojuegos` WHERE idjuego=?',[idjuego]); 
    console.log(videojuegos[0]);
    res.render('juegos/edit',{videojuegos:videojuegos[0]});
});

//EDITAR DATOS DE LOS VIDEOJUEGOS SIN CAMBIAR EL ESTATUS 
router.post('/edit/:idjuego',isLoggedIn, async (req,res)=>{
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
    req.flash('correcto','EDITADO CORRECTAMENTE')
    res.redirect('/juegos');
});

module.exports=router;