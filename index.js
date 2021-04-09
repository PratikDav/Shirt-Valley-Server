const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

// console.log(process.env.DB_User)
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })



const uri =`mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.p3vuj.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const productCollection = client.db("shirtVallay").collection("products");
  const ordersCollection = client.db("shirtVallay").collection("orders");
  
    app.get('/product', (req, res) => {
        productCollection.find()
        .toArray((err, product) => {
            res.send(product)
            
        })
    })

    app.get('/product/:id', (req, res) => {
      productCollection.find({_id:  ObjectId(req.params.id)})
      .toArray((err, product) => {
          res.send(product)
          
          
      })
  })

  app.get('/orderPreview/:email', (req, res)=>{
    ordersCollection.find({email: req.params.email})
    .toArray((err,orderProduct) => {
      res.send(orderProduct)
    })
  })

  app.get('/orderCollection', (req, res)=>{
    ordersCollection.find({})
    .toArray((err, product) => {
      res.send(product)
      
  })
  })

  app.delete('/delete/:id', (req, res)=>{
    const id = ObjectId(req.params.id)
    // const order = req.params
    console.log('delete this',id)
    ordersCollection.deleteOne({_id: id})
     .then(result => {
      //  console.log(result)
     })
  })

  app.delete('/delete/:id', (req, res)=>{
    const id = ObjectId(req.params.id)
    
    console.log('delete this',id)
    productCollection.deleteOne({_id: id})
     .then(result => {
       console.log(result)
      res.send(result.deletedCount > 0)
     })
  })


  app.post('/addProduct', (req, res) => {
      const event = req.body;
      productCollection.insertOne(event)
      .then(result => {
          console.log('insertCount',result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        console.log('insertCount',result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})
  
});


app.listen(port)