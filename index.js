const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const { json } = require('express');

require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
// 


app.get('/', (req, res) => {
    res.send('amar sunar modina mar praner')
})



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.oq7uvoj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT(req, res, next) {

    const authHeaders = req.headers.authorization
    console.log(authHeaders)

    if (!authHeaders) {
        res.status(401).send({ massage: 'unauthoriz' })
    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, process.env.USER_KEY, function (error, decoded) {
        if (error) {
            res.status(401).send({ massage: 'unauthorized' })

        }
        req.decoded = decoded;
        next()
    })
}

function run() {

    try {
        const FoodCollection = client.db('foodbar').collection('food')
        const reviewcollection = client.db('revieitem').collection('review')

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.USER_KEY, { expiresIn: '1h' })
            res.send({ token })


        })
        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = FoodCollection.find(query)

            const result = await cursor.sort({ _id: -1 }).limit(3).toArray()
            res.send(result)
        })
        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = FoodCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/service', async (req, res) => {
            const query = req.body;

            const result = await FoodCollection.insertOne(query)
            res.send(result)
        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await FoodCollection.findOne(query)
            res.send(service)
        })
        app.post('/users', async (req, res) => {
            const query = req.body
            const result = await reviewcollection.insertOne(query)
            res.send(result)
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;

            const query = { categori: id }
            const cursor = await reviewcollection.find(query).toArray()
            res.send(cursor)

        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await reviewcollection.deleteOne(query)

            res.send(result)

        })
        app.get('/users', verifyJWT, async (req, res) => {
            const decoded = req.decoded;

            if (decoded.email !== req.query.email) {

                res.status(401).send({ massage: 'unauthorized' })
            }
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewcollection.find(query)
            const review = await cursor.toArray()
            res.send(review)

        })


    }
    finally {



    }

}
run()



app.listen(port, () => {
    console.log(`this server is running on ${port}`)
})