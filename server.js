"use strict"
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('./dbconn/model')
const path = require('path')
var jwt = require('jsonwebtoken');
const { UserModel, bookingModel, areaModel } = require('./dbconn/model')
const app = express()
const PORT = process.env.PORT || 4000
const authRoutes = require('./authroutes/auth')
var SERVER_SECRET = process.env.SECRET || "1234";

app.use(cors({
    origin: ["http://localhost:3000","https://parking-app-react.herokuapp.com"],
    credentials: true
}))
app.use("/", express.static(path.resolve(path.join(__dirname, "./client/build"))))
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
            if (diff > 30000000000) {
                res.status(401).send("token expired")
            } else {
                const MAX_AGE_OF_TOKEN = 86400000
                var token = jwt.sign({
                    id: decodedData.id,
                    firstName: decodedData.firstName,
                    lastName: decodedData.lastName,
                    email: decodedData.email,
                    phone: decodedData.phone
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: MAX_AGE_OF_TOKEN,
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

    UserModel.findById(req.body.jToken.id, 'firstName lastName email phone role createdOn',
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

app.post('/booking', async (req, res) => {
    try {
        if (!req.body.startDate ||
            !req.body.endDate ||
            !req.body.slot ||
            !req.body.location
        ) {

            res.status(403).send(`
                please send name, email, passwod, phone and gender in json body.
                e.g:
                {
                    "name": "jahanzaib",
                    "email": "jahanzaib@gmail.com",
                    "password": "123",
                    "phone": "034320492",
                    "gender": "Male"
                }`)
        }
        const user = await UserModel.findOne({ email: req.body.jToken.email })
        console.log("user", user.email)
        if (!user) {
            res.send("no user found fot the given ID")
        }
        const { startDate, endDate, slot } = req.body
        console.log(slot)

        let start = new Date(startDate)
        let end = new Date(endDate)

        console.log(start, end)
        start.setMilliseconds(0)
        start.setSeconds(0)
        end.setMilliseconds(0)
        end.setSeconds(0)

        start = start.getTime()
        end = end.getTime()

        const startData = await bookingModel.find({ startDate: { $gte: new Date(start), $lte: new Date(end) }, slot, location: req.body.location })
        const endData = await bookingModel.find({ endDate: { $lte: new Date(end), $gte: new Date(start) }, slot, location: req.body.location })

        console.log("Start Data", startData)
        console.log("End Data", endData)

        if (startData.length !== 0 || endData.length !== 0) {
            res.send({ status: 403, message: "Sorry! Slot is not available at this time" })
        }
        else {
            let newBooking = new bookingModel({
                firstName: user.firstName,
                lastName: user.lastName,
                slot: req.body.slot,
                email: user.email,
                location: req.body.location,
                phone: user.phone,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            })
            const successData = await newBooking.save()
            res.send({ status: 200, successData: successData, message: "Slot has booked Successfully" });
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get('/getBookings', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.jToken.email })

        if (!user) {
            res.send("no user found fot the given ID")
        }

        const bookingData = await bookingModel.find({email: req.body.jToken.email})

        if (bookingData) {
            res.status(200).send({
                data: bookingData
            })
        }
        else {
            res.status(403).send("something went wrong")
        }

    }
    catch (error) {
        res.status(400).send(error.message)
    }
})

app.post('/validateSlot', async (req, res) => {
    try {
        if (!req.body.startDate || !req.body.endDate || !req.body.location) {

            res.status(403).send(`
                please send name, email, passwod, phone and gender in json body.
                e.g:
                {
                    "name": "jahanzaib",
                    "email": "jahanzaib@gmail.com",
                    "password": "123",
                    "phone": "034320492",
                    "gender": "Male"
                }`)
        }
        const user = await UserModel.findOne({ email: req.body.jToken.email })
        console.log(user)
        if (!user) {
            res.send("no user found fot the given ID")
        }

        const { startDate, endDate } = req.body

        let start = new Date(startDate)
        let end = new Date(endDate)

        console.log("startDate", start)
        console.log("endDate", end)
        start.setMilliseconds(0)
        start.setSeconds(0)
        end.setMilliseconds(0)
        end.setSeconds(0)

        start = start.getTime()
        end = end.getTime()

        console.log("startDate", start)
        console.log("endDate", end)

        const startData = await bookingModel.find({ startDate: { $gte: new Date(start), $gte: new Date(end) }, location: req.body.location })
        const endData = await bookingModel.find({ endDate: { $gte: new Date(end), $gte: new Date(start) }, location: req.body.location })

        console.log("startDate ====", startData)
        console.log("endDate ======", endData)
        if (startData.length !== 0 || endData.length !== 0) {
            res.send({
                status: 200,
                data: {
                    startData,
                    endData
                }
            })
        } else {
            res.send("not found")
        }

    }
    catch (error) {
        res.status(400).send(error.message)
    }
})

app.post('/addAreaDetails', async (req, res) => {

    try {
        console.log("adhajhdk", req.body)
        if (!req.body.location || !req.body.desc || !req.body.slots || !req.body.imgURl) {

            res.status(403).send(`
                please send name, email, passwod, phone and gender in json body.
                e.g:
                {
                    "name": "jahanzaib",
                    "email": "jahanzaib@gmail.com",
                    "password": "123",
                    "phone": "034320492",
                    "gender": "Male"
                }`)
        }
        const user = await UserModel.findOne({ email: req.body.jToken.email })
        if (!user) {
            res.send("no user found fot the given ID")
        }

        const newData = new areaModel({
            location: req.body.location,
            slots: req.body.slots,
            desc: req.body.desc,
            imgUrl: req.body.imgURl
        })

        const successData = await newData.save()

        if (successData) {
            res.status(200).send({
                message: "Successfully Added",
                data: successData
            })
        }
        else {
            res.status(400).send('something went wrong')
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get('/getLocations', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.jToken.email })
        if (!user) {
            res.send("no user found fot the given ID")
        }

        const data = await areaModel.find({})
        console.log(data)
        if (data) {
            res.status(200).send({
                data: data
            })
        } else {
            res.status(400).send("Something went wrong")
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
})
app.get('/logout', (req, res) => {
    res.clearCookie('jToken')
    res.send("clear")
})

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT)
})