import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag, Button } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

function AdminUserScreen() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const columns = [
		{ title: "User ID", dataIndex: "_id", key: "_id" },
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{ title: "Email", dataIndex: "email", key: "email" },

		{
			title: "Admin Status",
			dataIndex: "isAdmin",
			key: "isAdmin",
			render: (isAdmin, user) => (
				<>
					{isAdmin ? (
						<Tag color="green">YES</Tag>
					) : (
						<>
							<Tag color="red">NO</Tag>
							<Button
								type="link"
								onClick={() => makeAdmin(user._id)}
								style={{ padding: 0, border: "none", color: "#1890ff" }}
							>
								Make Admin
							</Button>
						</>
					)}
				</>
			),
		},
	];

	async function fetchMyData() {
		setError("");
		setLoading(true);
		try {
			const data = (await axios.post("/api/users/getallusers")).data;
			setUsers(data);
		} catch (error) {
			console.log(error);
			setError(error.message);
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchMyData();
	}, []);

	const makeAdmin = async (userId) => {
		setError("");
		setLoading(true);
		try {
			await axios.post(`/api/users/makeAdmin/${userId}`, );
			fetchMyData(); // Refresh the user list after making a user admin
		} catch (error) {
			console.log(error);
			setError(error.message);
		}
		setLoading(false);
	};

	return (
		<div className="row">
			{loading ? (
				<Loader />
			) : error ? (
				<Error msg={error} />
			) : (
				<div className="col-md-12">
					<Table columns={columns} dataSource={users} rowKey="_id" />
				</div>
			)}
		</div>
	);
}

export default AdminUserScreen;
