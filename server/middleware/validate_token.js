const { verify, TokenExpiredError } = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './.env'});

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('Authorization') || req.get('authorization');
        if(token) {
            token = token.slice(7);
            verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err){
                    if (err instanceof TokenExpiredError) {
                        // Handle the case when the token has expired
                        return res.status(401).json({
                            success: 0,
                            message: 'Token has expired',
                        });
                    } else {
                        return res.sendStatus(401).json({
                            success: 0,
                            message: 'Invalid token'
                        });
                    }
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            return res.sendStatus(401).json({
                success: 0,
                message: 'Access denied! unauthorised user'
            })
        }
    }
}