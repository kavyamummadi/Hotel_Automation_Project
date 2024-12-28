const express = require("express");
const router = express.Router();

const Room = require("../models/room");

router.get("/getallrooms", async (req, res) => {
	try {
		const rooms = await Room.find({});
		res.send(rooms);
	} catch (error) {
		return res.status(400).json({ message: error });
	}
});

router.post("/getroombyid", async (req, res) => {
	try {
		const roomid = req.body.roomid;
		const room = await Room.findOne({ _id: roomid });
		res.send(room);
	} catch (error) {
		return res.status(400).json({ message: error });
	}
});

router.post("/getallrooms", async (req, res) => {
	try {
		const rooms = await Room.find();
		res.send(rooms);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error });
	}
});

router.post("/addroom", async (req, res) => {
	try {
		const newRoom = req.body;
		console.log(req.body);
		const room = new Room();
		room.name = newRoom.name;
		room.maxcount = newRoom.maxcount;
		room.phonenumber = newRoom.phonenumber;
		room.rentperday = newRoom.rentperday;
		room.type = newRoom.type;
		room.description = newRoom.description;
		room.currentbookings = [];
		if (newRoom.imageurl1 && newRoom.imageurl1.length > 0) {
			room.imageurls.push(newRoom.imageurl1);
		}
		if (newRoom.imageurl2 && newRoom.imageurl2.length > 0) {
			room.imageurls.push(newRoom.imageurl2);
		}
		if (newRoom.imageurl3 && newRoom.imageurl3.length > 0) {
			room.imageurls.push(newRoom.imageurl3);
		}

		const result = await room.save();
		res.send(result);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error });
	}
});

/*router.post("/update/room/:id", async (req, res) => {
	try {
		const roomId = req.params.id;
		const newRoomData = req.body; // Data sent from the client

		// Find room by ID
		const room = await Room.findById(roomId);
		if (!room) {
			return res.status(404).json({ message: "Room not found" });
		}

		// Merge new data into the room object
		Object.assign(room, {
			name: newRoomData.name,
			maxcount: newRoomData.maxcount,
			phonenumber: newRoomData.phonenumber,
			rentperday: newRoomData.rentperday,
			type: newRoomData.type,
			description: newRoomData.description,
			currentbookings: [], // Clear current bookings if required
		});

		// Update images if provided
		room.imageurls = []; // Clear current images
		if (newRoomData.imageurl1) room.imageurls.push(newRoomData.imageurl1);
		if (newRoomData.imageurl2) room.imageurls.push(newRoomData.imageurl2);
		if (newRoomData.imageurl3) room.imageurls.push(newRoomData.imageurl3);

		// Save the updated room
		const result = await room.save();
		res.send(result);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error.message });
	}
});*/
router.put("/update/room/:id", async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        Object.assign(room, req.body);
        const updatedRoom = await room.save();
        res.send(updatedRoom);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});


router.delete("/delete/room/:id", async (req, res) => {
	try {
		const roomId = req.params.id;

		// Find and delete the room by ID
		const room = await Room.findByIdAndDelete(roomId);

		// If room not found, send 404 response
		if (!room) {
			return res.status(404).json({ message: "Room not found" });
		}

		// Room successfully deleted
		res.json({ message: "Room deleted successfully" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error.message });
	}
});

module.exports = router;
