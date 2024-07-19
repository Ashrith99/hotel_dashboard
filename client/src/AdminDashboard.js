const React = require('react');
const { useState, useEffect } = require('react');
const { db } = require('./firebase');
const { collection, onSnapshot, query, orderBy } = require('firebase/firestore');

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [orderDelivered, setOrderDelivered] = useState({});

    useEffect(() => {
        const ordersRef = collection(db, 'orders');
        const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));
    
        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const ordersList = snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data };
            });
            setOrders(ordersList);
    
            // Update the orderDelivered state based on the fetched data
            const deliveredStatus = {};
            ordersList.forEach(order => {
                deliveredStatus[order.id] = order.isDelivered;
            });
            setOrderDelivered(deliveredStatus);
        }, (error) => {
            setError(error.message);
        });
    
        return () => unsubscribe();
    }, []);

    const handleBoxClick = (tableNumber) => {
        setSelectedTable(tableNumber);
    };

    const handleOrderDelivered = async (orderId) => {
        try {
            await fetch('http://localhost:5000/markAsDelivered', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId }),
            });
    
            setOrderDelivered(prev => ({
                ...prev,
                [orderId]: true,
            }));
        } catch (error) {
            console.error('Error marking order as delivered:', error);
        }
    };

    const getOrderDetails = (tableNumber) => {
        return orders.filter(order => order.tableNumber === tableNumber);
    };

    const getOrderColor = (orderId) => {
        return orderDelivered[orderId] ? 'green' : 'red';
    };

    const isTableAllDelivered = (tableNumber) => {
        const tableOrders = getOrderDetails(tableNumber);
        return tableOrders.every(order => orderDelivered[order.id]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1 }}>
                <h1>Admin Dashboard</h1>
                {error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div>
                        <h2>Tables</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(tableNumber => (
                                <div
                                    key={tableNumber}
                                    onClick={() => handleBoxClick(tableNumber)}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        backgroundColor: getOrderDetails(tableNumber).length && !isTableAllDelivered(tableNumber) ? 'red' : 'green',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Table {tableNumber}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div style={{ flex: 1, paddingLeft: '20px' }}>
                {selectedTable && (
                    <div>
                        <h2>Order Details for Table {selectedTable}</h2>
                        {getOrderDetails(selectedTable).length ? (
                            getOrderDetails(selectedTable).map((order) => (
                                <div key={order.id} style={{
                                    backgroundColor: getOrderColor(order.id),
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginBottom: '10px'
                                }}>
                                    <ul>
                                        {order.dishes.map((dish, index) => (
                                            <li key={index}>
                                                {dish.name} - {dish.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={() => handleOrderDelivered(order.id)}>Ordered</button>
                                </div>
                            ))
                        ) : (
                            <p>No orders for this table</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

