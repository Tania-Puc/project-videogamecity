const bcrypt=require('bcryptjs');
const helpers ={};
helpers.encryptPassword= async (contrasena)=>{
    const salt =await bcrypt.genSalt(10);
    const hash=bcrypt.hash(contrasena, salt);
    return hash;

};

helpers.matchPassword= async(contrasena,savePassword)=>{
    try {
        return await bcrypt.compare(contrasena,savePassword);

    } catch (e) {
          console.log(e)
    }
};

module.exports=helpers;