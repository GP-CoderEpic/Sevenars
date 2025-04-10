// Backend/service/authentication.js
import JWT from 'jsonwebtoken';

const secret = "$uperMan@345";

export function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
    };
    
    const token = JWT.sign(payload, secret);
    return token;
}

export function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}
