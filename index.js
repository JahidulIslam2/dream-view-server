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
        app.get('/service',async(req,res) =>{
            const query= {}
            const cursor =serviceCollection.find(query).limit(3);
            const service = await cursor.toArray();
            res.send(service);
        })

        app.get('/services', async (req, res) =>{
            const query= {}
            const cursor =serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/serviceDetails/:id', async(req,res)=>{
            const id = req.params.id;
            const query= {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })

        app.post('/review', async(req,res)=>{
            const review =req.body;
            const result =await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/review', async(req,res)=>{
            const query= {}
            const cursor =reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews); 

        })




}
finally {

}

}
run().catch(console.dir())





app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})
