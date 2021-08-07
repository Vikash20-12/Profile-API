const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//register route
router.post('/register', async(req, res)=>{
    //to check if email exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('This email already exists');

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    });
    try {
        const savedUser = await user.save();
        res.send(`${user._id, user.name} registered.`);
    } catch (error) {
        res.status(401).send(error);
    }
});




module.exports = router;
