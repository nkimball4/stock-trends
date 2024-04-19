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
            else{
                res.status(400).json({ error: 'Invalid login' });
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

const addToWatchlist = async (req, res) => {
    const { email, companyData } = req.body;
    console.log("Received request to add company " + JSON.stringify(companyData.financialData.shortName) + " to " + email + "'s watchlist");

    try {
        const user = await User.findOne({'loginInfo.email': email });
        console.log("User found");

        const isCompanyAlreadyAdded = user.userData.some(data => data.companyName === companyData.financialData.shortName);
        if (isCompanyAlreadyAdded) {
            console.log("Company already on user's watchlist, returning");
            return
        }

        console.log("searchData: " + JSON.stringify(companyData.searchData));
        console.log("financialData: " + companyData.financialData);
        console.log("historicalPriceData: " + companyData.historicalPriceData);
        console.log("name: " + companyData.financialData.shortName);
        console.log("sector: " + companyData.sector);

        user.userData.push({
            ai_response: JSON.stringify(companyData.searchData),
            financialData: companyData.financialData,
            historicalPriceData: companyData.historicalPriceData,
            companyName: companyData.financialData.shortName,
            sector: companyData.sector
        });
        await user.save();

        console.log("Company added to user's watchlist");
        res.status(200).json({ message: "Company added to user's watchlist" });
    } catch (error) {
        console.error("Error adding company to watchlist:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const checkIsCompanyOnUserWatchlist = async (req, res) => {
    try{
        let onWatchlist = false;
        console.log("Checking if company " + req.body.companyName + " is on user " + req.body.userEmail + "'s watchlist")
        if (req.body.userEmail){
            const user = await User.findOne({ 'loginInfo.email': req.body.userEmail });
            // console.log(user)
            console.log(req.body.companyName);
            const isCompanyAlreadyAdded = user.userData.some(data => data.companyName === req.body.companyName);
            if (isCompanyAlreadyAdded) {
                console.log("Company on user's watchlist");
                onWatchlist = true;
            }
        }
        console.log(onWatchlist)
        res.status(200).json(onWatchlist);
    }
    catch(error){
        console.error(error)
    }
}

const getUserWatchlist = async (req, res) => {
    try{
        console.log("=> Request received to send user " + req.body.email + "'s watchlist")
        if (req.body.userEmail){
            const user = await User.findOne({ 'loginInfo.email': req.body.userEmail });
            console.log(user.userData);
            res.status(200).json(user.userData);
        }
    }
    catch(error){
        console.error(error)
    }
}

module.exports = {createAccount, getAccount, addToWatchlist, checkIsCompanyOnUserWatchlist, getUserWatchlist};
