const User = require('./lib/user.js');
const getHeader = require('./lib/getHeader.js');

module.exports = (req, res, next) => {
    req.user = req.user || {};
    let authHeader = getHeader(req, next);
    if (req.user.message) return req, res, next();
    
    const newUser = new User(authHeader);
    User.findOne({username: authHeader['username']}).then(response => {
        if (response) {
            req.user.message = "Already Exists";
            next();
        } else {
            newUser.hashify(authHeader['password']).then(hash=> {
                newUser.password = hash.password;
                newUser.uuid = hash.uuid;
                newUser.save().then(response => {
                    req.user = "Account Created";
                    next();
                });
            });
        }
    });
};