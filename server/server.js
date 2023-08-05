require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let db = null;

const initializeAndConnect = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(MONGODB_URI, dbOptions);
    db = mongoose.connection;
    if (db.readyState === 1) {
      console.log("MongoDB connection established.");

      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
      });
    } else {
      console.log("MongoDB connection failed or pending.");
    }
  } catch (err) {
    console.log(`Db err ${err}`);
    process.exit(1);
  }
};
initializeAndConnect();

app.get("/books", async (req, res) => {
  try {
    const listCollection = db.collection("list");
    const getList = await listCollection.find({}).toArray();
    res.status(200).json({ list: getList });
  } catch {
    res.status(500).json({ error: "Internal Server Error", errorMsg: err });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const listCollection = db.collection("list");
    const getBook = await listCollection.findOne({ id: id });
    res.status(200).json({ book: getBook });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", errorMsg: err });
  }
});

app.post("/book/", async (req, res) => {
  try {
    const { title, authors, genre } = req.body;
    if (!title || !authors || !genre) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const listCollection = db.collection("list");
    const getLength = await listCollection.find({}).toArray();
    const bookId = getLength.length + 1;
    const insertObj = {
      title,
      authors,
      genre,
      id: bookId,
    };
    const insertQuery = await listCollection.insertOne(insertObj);
    res.status(200).json({ message: "Inserted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", errorMsg: err.message });
  }
});

app.put("/book/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const { title, authors, genre } = req.body;
    if (!title || !authors || !genre) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const listCollection = db.collection("list");
    const updateQuery = {
      $set: {
        title,
        authors,
        genre,
      },
    };

    const updatedBook = await listCollection.findOneAndUpdate(
      { id: id },
      updateQuery,
      { returnOriginal: false }
    );
    if (!updatedBook.value) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", errorMsg: err.message });
  }
});

app.delete("/book/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const listCollection = db.collection("list");
    await listCollection.deleteOne({ id: id });
    res.status(200).json({message: "Successfully Deleted"});
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", errorMsg: err.message });
  }
});
module.exports = app;