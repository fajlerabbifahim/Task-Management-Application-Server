const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

//middleware

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Paglu Paglu");
});

// MongoDB Connect

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.8jenr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    // *******All Collections********

    //user Collection

    const userCollection = client
      .db("Task-Management-Application")
      .collection("userCollection");

    //   task collection
    const taskCollection = client
      .db("Task-Management-Application")
      .collection("tasks");
    // ********CURD Operation ********

    // Post Request User Save To Database
    app.post("/user", async (req, res) => {
      const user = req.body;
      const email = user.email;
      const existingUser = await userCollection.findOne({ email: email });
      if (existingUser) {
        return { message: "user already exist" };
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //get user from database
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email: email });
      res.send(result);
    });

    // Task added to database

    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    // task get by user email
    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;
      const result = await taskCollection.find({ addedBy: email }).toArray();
      res.send(result);
    });

    //patch a tasks

    app.patch("/task/:id", async (req, res) => {
      const id = req.params.id;
      const { category } = req.body;

      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { category: category } }
      );

      res.send(result);
    });

    // delete a task

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;

      const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// app listen in this port

app.listen(port, () => {
  console.log(` Server running on ${port}`);
});
