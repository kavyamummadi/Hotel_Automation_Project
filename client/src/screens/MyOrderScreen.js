import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Tag } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

function MyOrderScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("currentUser"));

    async function fetchMyOrders() {
        setError("");
        setLoading(true);
        try {
            const data = (
                await axios.post("/api/order-items/getordersbyuserid", {
                    userid: user._id,
                })
            ).data;
            setOrders(data);
            console.log(data);
        } catch (error) {
            console.log(error);
            setError(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchMyOrders();
    }, []);

    async function cancelOrder(orderId, foodItemId) {
        setError("");
        setLoading(true);
        try {
            const data = (
                await axios.post("/api/order-items/cancelorder", {
                    orderId,
                    foodItemId,
                })
            ).data;
            setLoading(false);
            Swal.fire(
                "Congratulations",
                "Your Order Cancelled Successfully",
                "success"
            ).then((result) => {
                fetchMyOrders();
            });
        } catch (error) {
            console.log(error);
            Swal.fire("Oops", "Error: " + error.message, "error");
        }
        setLoading(false);
    }

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error.length > 0 ? (
                <Error msg={error} />
            ) : (
                <div className="row">
                    <div className="col-md-6 ml-5">
                        {orders &&
                            orders.map((order) => {
                                console.log(order);
                                return (
                                    <div className="bs" key={order._id}>
                                        <h1>{order.itemId.name}</h1>
                                        <p>
                                            <b>OrderId:</b> {order._id}
                                        </p>
                                        <p>
                                            <b>Quantity:</b> {order.quantity}
                                        </p>
                                        <p>
                                            <b>Total Price:</b>  &#8377;{order.totalPrice}
                                        </p>
                                        <p>
                                            <b>Status:</b>{" "}
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
                                                    onClick={() => {
                                                        cancelOrder(order._id, order.itemId._id);
                                                    }}
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrderScreen;
