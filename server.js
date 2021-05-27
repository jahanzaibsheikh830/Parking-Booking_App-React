const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('./dbconn/model')
var jwt = require('jsonwebtoken');
const {UserModel} = require('./dbconn/model')
const app = express()
const PORT = process.env.PORT || 4000
const authRoutes = require('./authroutes/auth')
var SERVER_SECRET = process.env.SECRET || "1234";

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(authRoutes)
app.use(function (req, res, next) {
    console.log(req.cookies.jToken)
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {
            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;
            if (diff > 300000) {
                res.status(401).send("token expired")
            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    role: decodedData.role
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86400000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/profile", (req, res, next) => {

    console.log(req.body)

    UserModel.findById(req.body.jToken.id, 'firstName lastName email phone createdOn',
        function (err, doc) {
            console.log("doc", doc)
            if (!err) {
                res.send({
                    status: 200,
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})
app.get('/',(req,res,next)=>{
    res.send('Running')
})


app.listen(PORT,()=>{
    console.log("Server is running on port: " , PORT)
})