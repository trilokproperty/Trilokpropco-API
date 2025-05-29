// middleware/auth.js
import jwt from 'jsonwebtoken';

// Verify Token
export const verifyToken = (req, res, next) => {
  try{
    const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        // console.log('Token received:', token);
        // console.log('JWT Secret:', process.env.JWT_TOKEN);

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token missing" });
        }

        jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
            if (err) {
                // console.log('JWT Error:', err);
                return res.status(401).json({ error: "Unauthorized: Invalid token 00" });
            }
            req.decoded = decoded;
            next();
        });
  } catch (e){
    console.log(e.message)
    res.status(500).json({message: "Internal Serval Error."})
}
};

// Verify Admin Middleware
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.decoded.role)
    if (req.decoded.role === 'admin') { // Use req.decoded instead of req.user
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized: Admins Only' });
    }
  });
};

// Verify Editor Middleware
export const verifyEditor = (req, res, next) => {
  verifyToken(req, res, () => {
    // console.log(req.decoded.role)
    if (req.decoded.role === 'editor' || req.decoded.role === 'admin') { // Use req.decoded instead of req.user
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized: Only Admin & Editor have access.' });
    }
  });
};
