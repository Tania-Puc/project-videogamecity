const express=require('express');
const router=express.Router();

router.get('/', (req, res)=>{
    res.send("HELLOW WORLD")
});

module.exports=router;