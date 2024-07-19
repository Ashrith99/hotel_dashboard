const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const { db } = require('./firebase');
const { collection, addDoc,  serverTimestamp } = require('firebase/firestore');

const app=express();
app.use(cors())
app.use(bodyParser.json());

let orders = [];

app.get("/getData", (req, res) => {
    res.json(orders);
});

app.post("/sendOrder", async (req, res) => {

    const { tableNumber, dishes } = req.body;
    
    const newOrder = { tableNumber, dishes, createdAt: serverTimestamp() };
    

    try {
        await addDoc(collection(db, 'orders'), newOrder);
        res.send("Order received successfully");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

const PORT = 5000;
app.listen(PORT, function() { 
    console.log(`Server is running on port ${PORT}`);
});
// send url
// http://localhost:5000/sendOrder

// send data example
// {
//     "tableNumber": 555,
//     "dishes": [
//         { "name": "Spaghetti Carbonara", "quantity": 2 },
//         { "name": "Margherita Pizza", "quantity": 1 },
//         { "name": "Tiramisu", "quantity": 3 }
//     ]
// }