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


//Login route
router.post('/login', async(req, res)=>{
    // const user = await User.findOne({name: req.body.name});
    // if(!user) return res.status(400).send('User Not Found');

    //check if email is correct
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(401).send(`user not found`);

    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(401).send('Invalid Password');

    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN);
    res.header('auth-token', token).send(`${user.name} logged In.`);
});


module.exports = router;
