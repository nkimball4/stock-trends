const User = require('../db/models/userModel'); // Assuming your schema is defined in a file named User.js

const createAccount = async (req, res) => {
    const { name, email, password, confirmPassword, acknowledge } = req.body;

    console.log("=> Request received to create user " + email);

    if (password !== confirmPassword){
        return res.status(400).json({error: 'Passwords do not match'})
    }

    try {
        const existingUser = await User.findOne({ 'loginInfo.email': email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newUser = new User({
            userData: [],
            loginInfo: {
                name,
                email,
                password,
                acknowledge,
            }
        });

        await newUser.save();

        res.status(201).json({ message: 'User account created successfully' });
    } catch (error) {
        console.error('Error creating user account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAccount = async (req, res) => {
    const { email, password } = req.body;

    console.log("=> Request received to login user " + email);

    try {
        const existingUser = await User.findOne({ "loginInfo.email": email });
        if (existingUser){
            console.log("=> Found user")
            const validLogin = await validateLogin(email, password, existingUser);
            if (validLogin) {
                res.status(200).json({ userData: existingUser.userData});
            }
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const validateLogin = async (email, password, existingUser) => {
    console.log("=> Validating login")

    if (password === existingUser.loginInfo.password){
        console.log("=> Login valid");
        return true;
    }
    else{
        console.log("=> Login invalid")
        return false;
    }
}

module.exports = {createAccount, getAccount};
