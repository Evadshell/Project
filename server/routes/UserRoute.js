import  Users from '../models/User.js';
import express from 'express';
const router = express.Router();
router.post('/',async(req,res)=>{
    try {
        if(!req.body.username || !req.body.password){
            return res.status(400).send({
                message : 'fill up all details',
            })
        }
        const NewUser = {
            username : req.body.username,
            password : req.body.password,
        }
        const user = await Users.create(NewUser);//to create or add data in that schema 
        return res.status(201).send(user);
    } catch (error) {
        console.log(error);
    }
})
export default router;