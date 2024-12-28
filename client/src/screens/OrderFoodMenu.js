import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function FoodMenu() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  // Fetch menu items from the API
  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get("/api/food-items"); // Replace with your API endpoint
        setMenuItems(data);
      } catch (err) {
        setError("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  // Handle Order Now functionality
  const orderNow = async (item) => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      console.log(user);
      if (!user) {
        Swal.fire("Not Logged In", "Please log in to place an order.", "error");
        return;
      }

      const orderDetails = {
        itemId: item._id,
        userId: user._id, // Ensure user information is present
        quantity: 1, // Default quantity (can be customized)
        totalAmount: item.price,
      };

      // Send order details to backend API
      const response = await axios.post("/api/order-items/order", orderDetails);

      // Success notification
      Swal.fire(
        "Order Placed",
        `Your order for ${item.name} has been placed successfully.`,
        "success"
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Order Failed", "An error occurred while placing your order.", "error");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h1>Food Menu</h1>
      <div className="row">
        {menuItems.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <div className="card">
              <img
                src={item.image}
                alt={item.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text">Price:  &#8377;{item.price}</p>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => orderNow(item)}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodMenu;
