import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Tag } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

function ViewOrderScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch orders for the food manager
    async function fetchOrders() {
        setError("");
        setLoading(true);
        try {
            const response = await axios.get("/api/order-items/getAllOrders");
            setOrders(response.data);
        } catch (error) {
            console.log(error);
            setError("Failed to fetch orders");
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    // Handler to cancel an order
    async function cancelOrder(order) {
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(
                "/api/order-items/cancelorder",
                { orderId:order._id,foodItemId:order.itemId._id },   
            );

            Swal.fire("Success", "Order cancelled successfully", "success").then(() => {
                fetchOrders();
            });
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Could not cancel the order", "error");
        }
        setLoading(false);
    }

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Error msg={error} />
            ) : (
                <div className="row">
                    <div className="col-md-8 ml-5">
                        <h2>All Orders</h2>
                        {orders.length === 0 ? (
                            <p>No orders found</p>
                        ) : (
                            orders.map((order) => {
                                return (
                                    <div className="order-card" key={order._id} style={{border:"2px solid black",padding:"20px",margin:"10px"}}>
                                        <h3>{order.itemId.name}</h3>
                                        <p><strong>Order ID:</strong> {order._id}</p>
                                        <p><strong>Customer:</strong> {order.userId.name}</p>
                                        <p><strong>Email:</strong> {order.userId.email}</p>
                                        <p><strong>Quantity:</strong> {order.quantity}</p>
                                        <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                                        <p><strong>Status:</strong>{" "}
                                            {order.status === "Pending" ? (
                                                <Tag color="orange">PENDING</Tag>
                                            ) : order.status === "Confirmed" ? (
                                                <Tag color="green">CONFIRMED</Tag>
                                            ) : order.status === "Delivered" ? (
                                                <Tag color="blue">DELIVERED</Tag>
                                            ) : (
                                                <Tag color="red">CANCELLED</Tag>
                                            )}
                                        </p>
                                        {order.status === "Pending" && (
                                            <div className="text-right">
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => cancelOrder(order)}
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewOrderScreen;
