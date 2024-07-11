const React = require('react');
const { useState, useEffect } = require('react');
const { db } = require('./firebase'); 
const { collection, onSnapshot } = require('firebase/firestore');


const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ordersRef = collection(db, 'orders');
        const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
            const ordersList = snapshot.docs.map(doc => doc.data());
            setOrders(ordersList);
        }, (error) => {
            setError(error.message);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <h2>Orders</h2>
                    <ul>
                        {orders.map((order, index) => (
                            <li key={index}>
                                <strong>Table Number:</strong> {order.tableNumber}
                                <ul>
                                    {order.dishes.map((dish, dishIndex) => (
                                        <li key={dishIndex}>
                                            {dish.name} - {dish.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
