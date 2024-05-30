const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error(`Error while verifying token: ${err.message}`);
                return reject(err);
            }
            resolve(decoded);
        });
    });
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    verifyToken(token)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.error(`Error while authenticating token: ${err.message}`);
            res.sendStatus(403);
        });
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
};
