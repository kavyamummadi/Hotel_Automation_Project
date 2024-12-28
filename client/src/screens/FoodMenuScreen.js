import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Modal, notification, Form, Input } from "antd";
import axios from "axios";

function FoodMenuScreen() {
    const [foodItems, setFoodItems] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    useEffect(() => {
        fetchFoodItems();
    }, []);

    const fetchFoodItems = async () => {
        try {
            const response = await axios.get('/api/food-items');
            setFoodItems(response.data);
        } catch (error) {
            notification.error({
                message: "Failed to fetch food items",
                description: error.message,
            });
        }
    };

    const handleAddFoodItem = async (values) => {
        try {
            const response = await axios.post('/api/food-items', values);
            setFoodItems([...foodItems, response.data]);
            setIsAddModalVisible(false);
            notification.success({
                message: "Food Item Added",
                description: `${values.name} has been added to the menu.`,
            });
        } catch (error) {
            notification.error({
                message: "Failed to add food item",
                description: error.message,
            });
        }
    };

    const handleEditFoodItem = async (values) => {
        try {
            const response = await axios.put(`/api/food-items/${selectedFood._id}`, values);
            const updatedItems = foodItems.map((item) =>
                item._id === selectedFood._id ? response.data : item
            );
            setFoodItems(updatedItems);
            setIsEditModalVisible(false);
            notification.success({
                message: "Food Item Updated",
                description: `${values.name} has been updated.`,
            });
        } catch (error) {
            notification.error({
                message: "Failed to update food item",
                description: error.message,
            });
        }
    };

    const handleDeleteFoodItem = async () => {
        try {
            await axios.delete(`/api/food-items/${selectedFood._id}`);
            const updatedItems = foodItems.filter((item) => item._id !== selectedFood._id);
            setFoodItems(updatedItems);
            setIsDeleteModalVisible(false);
            notification.success({
                message: "Food Item Deleted",
                description: `${selectedFood.name} has been deleted from the menu.`,
            });
        } catch (error) {
            notification.error({
                message: "Failed to delete food item",
                description: error.message,
            });
        }
    };

    const handleViewDetails = (food) => {
        setSelectedFood(food);
        setIsModalVisible(true);
    };

    return (
        <div className="ml-3 mt-3 mr-3 bs">
            <h1 className="text-center">Food Menu</h1>
            <div className="mb-3 text-right">
                <Button style={{backgroundColor:"black",border:"none",borderRadius:"20px",color:"white"}} onClick={() => setIsAddModalVisible(true)}>
                    Add Menu Item
                </Button>
            </div>
            <Row gutter={[16, 16]} style={{margin:"20px",padding:"10px"}}>
                {foodItems.map((food) => (
                    <Col key={food._id} >
                        <Card  
                            title={food.name}
                            style={{ height: '350px', width: '300px',margin:"20px" }} 
                            cover={<img alt={food.name} src={food.image} />}
                            bordered={true}
                            extra={`₹${food.price}`}
                            actions={[
                                <Button type="dark" onClick={() => { setSelectedFood(food); setIsEditModalVisible(true); }}>
                                    Edit
                                </Button>,
                                <Button type="danger" onClick={() => { setSelectedFood(food); setIsDeleteModalVisible(true); }}>
                                    Delete
                                </Button>,
                                <Button type="dark" onClick={() => handleViewDetails(food)}>
                                    View Details
                                </Button>,
                            ]}
                            
                        >
                            <p>{food.description}</p>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* View Details Modal */}
            <Modal
                title={selectedFood?.name}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    //   <Button key="add" type="primary" onClick={() => {
                    //     notification.success({
                    //       message: "Added to Cart",
                    //       description: `${selectedFood.name} has been added to your cart.`,
                    //     });
                    //     setIsModalVisible(false);
                    //   }}>
                    //     Add to Cart
                    //   </Button>,
                ]}
            >
                <p><strong>Price:</strong> ${selectedFood?.price}</p>
                <p>{selectedFood?.description}</p>
                <img alt={selectedFood?.name} src={selectedFood?.image} style={{ width: "100%", height: "auto" }} />
            </Modal>

            {/* Add New Food Item Modal */}
            <Modal
                title="Add New Food Item"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleAddFoodItem}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the food name" }]}>
                        <Input placeholder="Enter food name" />
                    </Form.Item>
                    <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price" }]}>
                        <Input type="number" placeholder="Enter price" />
                    </Form.Item>
                    <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter a description" }]}>
                        <Input placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item label="Image URL" name="image" rules={[{ required: true, message: "Please enter the image URL" }]}>
                        <Input placeholder="Enter image URL" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Food Item
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Food Item Modal */}
            <Modal
                title="Edit Food Item"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" initialValues={selectedFood} onFinish={handleEditFoodItem}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the food name" }]}>
                        <Input placeholder="Enter food name" />
                    </Form.Item>
                    <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price" }]}>
                        <Input type="number" placeholder="Enter price" />
                    </Form.Item>
                    <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter a description" }]}>
                        <Input placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item label="Image URL" name="image" rules={[{ required: true, message: "Please enter the image URL" }]}>
                        <Input placeholder="Enter image URL" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Food Item
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Food Item Modal */}
            <Modal
                title="Delete Food Item"
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                footer={null}
            >
                <p>Are you sure you want to delete {selectedFood?.name}?</p>
                <Button type="danger" onClick={handleDeleteFoodItem}>
                    Yes, Delete
                </Button>
                <Button onClick={() => setIsDeleteModalVisible(false)}>
                    Cancel
                </Button>
            </Modal>
        </div>
    );
}

export default FoodMenuScreen;
