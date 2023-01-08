const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
//  middleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.koq1h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const laptopCollection = client.db('warehouse-laptop').collection('laptop');
        app.get("/laptop",async(req,res) => {
            const query ={};
            const cursor = laptopCollection.find(query);
            const laptops = await cursor.toArray();
            res.send(laptops);

        });
        app.get("/laptop/:id",async(req,res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const laptop = await laptopCollection.findOne(query);
            res.send(laptop);

        })

         // getting  a  particular product

    app.get("/product/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
  
        const result = await laptopCollection.findOne(query);
        res.send(result);
      });

        // post a product
        
        app.post('/laptop',async(req,res) => {
            const newLaptop= req.body;
            const result = await laptopCollection.insertOne(newLaptop);
            console.log(result);
            res.send(result);

        })

        // delete a product

        app.delete('/laptop/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await laptopCollection.deleteOne(query);
            res.send(result);
        });

        // Update a item 

        
    // Update a product

    app.put("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: updatedProduct,
      };
      const result = await laptopCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      console.log(result);
      res.send(result);
    });
       


    }
    finally{

    }
}
run().catch(console.dir);


 
app.get('/',(req,res) => {
    res.send('Runnuing genius server');
})

app.listen(port,() => {
  console.log("listening port",port);
})


