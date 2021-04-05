const passport= require('passport');

const LocalStrategy = require('passport-local').Strategy;

const pool=require('../database');

const helpers= require('../lib/helpers');

passport.use("local.signin",
    new LocalStrategy(
      {
        usernameField: "correo",
        passwordField: "contrasena",
        passReqToCallback: true
      },
      async (req, correo, contrasena, done) => {
        const rows = await pool.query('SELECT*FROM usuario WHERE correo=?',[correo]);
        if (rows.length > 0) {
          const user = rows[0];
          const idtipo=user.idtipo;
          const validPassword= await helpers.matchPassword(contrasena, user.contrasena);
          if(idtipo){
           debugger;
          if (validPassword) {
                done(null, user, req.flash("correcto", "Bienvenido " + user.nombre));
                
               } else {
                done(null, false, {message: req.flash("error","contraseña incorrecta", )});
               }
          }else{
            done(null, false, req.flash("admin", "Intente iniciar como: "));
          }
         
        } else {
          return done(null,false,req.flash("error", "El usuario no existe."));
        }
      }
      )
      );

//REGISTRAR UN USUARIO CON LA CONTRASEÑA ENCRIPTADA
passport.use('local.singup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contrasena',
    passReqToCallback: true

},async (req, correo, contrasena, done)=>{
    const {nombre}=req.body;
    const idtipo=2;
    // console.log(req.body);
    const newuser={
        nombre,
        correo,
        contrasena,
        idtipo        
    };
    console.log(newuser);
    newuser.contrasena=await helpers.encryptPassword(contrasena);
    const result=await pool.query('INSERT INTO usuario SET ?',[newuser]);
    newuser.idusuario=result.insertId;
    console.log(result);
    return done(null,newuser);

}
));

passport.serializeUser((user, done) => {
    done(null, user.idusuario);
    console.log(user.idusuario)
  });

  
passport.deserializeUser(async(idusuario, done)=>{

    const rows=await pool.query('SELECT*FROM usuario where idusuario=?', [idusuario]);

    done(null,rows[0]);
    //console.log(rows[0]);
}); 