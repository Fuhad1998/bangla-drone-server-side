const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u15fw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){

    try{
        await client.connect();
        const database = client.db('drone_online_shop')
        const productCollection = database.collection('products')
        const ordersCollection = database.collection('orders')

        // Get products

        app.get('/products', async (req, res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        app.post('/products', async(req, res)=>{
            const product = req.body;
            const result = await productCollection.insertOne(product)
            res.json(result)
        })


            // add some text
        // add orders 

        // post orders
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // get orders
        app.get('/orders', async (req, res)=>{
            const email = req.query.email;
            let query 
            if (email){
                query = {email}
            }
            else{
                query={}
            }
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })

        // delate orders
        // 

        app.delete('/orders/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await ordersCollection.deleteOne(query)
            
            res.json(result)
        })
    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir)


app.get('/', (req, res)=>{
    res.send('bangla drone server is running')
})

// add  somthing


app.listen(port, ()=>{
    console.log('server running at port', port)
})

