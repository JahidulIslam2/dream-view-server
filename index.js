const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Dream view server Running...');
})


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gweohfd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        const serviceCollection = client.db("dreamViewDB").collection("servicesData");
        const reviewCollection = client.db("dreamViewDB").collection("review");


        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).limit(3);
            const service = await cursor.toArray();
            res.send(service);
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/serviceDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })
        //add service 
        app.post('/services', async (req, res) => {
            const add = req.body;
            const result = await serviceCollection.insertOne(add);
            res.send(result);
        })

        app.patch('/services/:id', async (req, res) => {
            const id = req.params.id;
            const newRating = req.body.newRating;
            const filter = { _id: ObjectId(id) }
            const updateRating = {
                $set: {
                    newRating: newRating
                }
            }
            const result = serviceCollection.updateOne(filter, updateRating)
            console.log(filter, updateRating)
            res.send(result)
        })

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);

        })

        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })


        app.get('/myreview', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)

        })

        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            const info = req.body.info;
            const query = { _id: ObjectId(id) };
            const update = {
                $set: {
                    info: info
                }

            }
            const result = await reviewCollection.updateOne(query, update)
            res.send(result)
        })




    }
    finally {

    }

}
run().catch(console.dir())





app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})
