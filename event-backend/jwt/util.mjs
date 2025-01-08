import jwt from "jsonwebtoken"

export const generateAccessToken = (user) => {

    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    )
}

export const generateRefreshToken = (user) => {

    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    )

}

export const verifyAuthorization = (req, res, next) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({
            message: "access token is missing"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = user; // Attach user data to request
        next();
    });
};

export const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
       return res.status(403).json({ message: "You do not have the required permission." });
    }
    next();
 };
