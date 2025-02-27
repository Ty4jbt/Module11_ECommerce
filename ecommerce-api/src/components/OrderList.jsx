import { func, number } from "prop-types";
import { useState, useEffect } from "react";

const OrderList = ({ customerId, onOrderSelect }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (customerId) {
            const fetchedOrders = [
                { id: 1, customerId: 1, total: 100 },
                { id: 2, customerId: 1, total: 200 },
                { id: 3, customerId: 2, total: 300 }
            ];
            setOrders(fetchedOrders);
        }
    }, [customerId]);

    return (
        <div className="order-list">
            <h3>Orders</h3>
            <ul>
                {orders.map(order => (
                    <li key={order.id} onClick={() => onOrderSelect(order.id)}>
                        Order ID: {order.id}, Total: {order.total}
                    </li>
                ))}
            </ul>
        </div>
    );
};

OrderList.propTypes = {
    customerId: number,
    onOrderSelect: func
};

export default OrderList;