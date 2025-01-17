const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    const { token } = req.session;
    const payload = jwt.verify(token, "fingerprint_customer")
    if (payload) {
        req.session.username = payload.username;
        next();
    }
    else {
        return res.status(403).json({ message: "User not authenticated" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.use("/", (err, req, res, next) => {
    res.status(400).json({ message: err.message });
    next(err);
});
app.listen(PORT, () => console.log("Server is running"));
