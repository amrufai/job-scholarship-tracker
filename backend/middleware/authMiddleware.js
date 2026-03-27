const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next) => {
    let token;

    // Check if the request has a header called "Authorization" that starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
        // The token looks like "Bearer eyJhbGciOiJIUzI1Ni...", so we split it and take the second part
        token = req.headers.authorization.split(" ")[1];

        // Verify the token using your secret key from the .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded?.id;
        if (id === undefined || id === null || Number.isNaN(Number(id))) {
          return res.status(401).json({ message: "Not authorized, invalid token" });
        }
        req.user = { id: Number(id) };

        next(); // The bouncer lets them pass to the actual route!
        } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

module.exports = { protect };