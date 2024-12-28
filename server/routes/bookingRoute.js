const express = require("express");
const moment = require("moment");
// const stripe = require("stripe")("YOUR PRIVATE STRIP API KEY"); //
const { v4: uuidv4 } = require("uuid"); //https://www.npmjs.com/package/uuid

const router = express.Router();

const Booking = require("../models/booking");
const Room = require("../models/room");

router.post("/getallbookings", async (req, res) => {
	try {
		const bookings = await Booking.find();
		res.send(bookings);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error });
	}
});

router.post("/cancelbooking", async (req, res) => {
	const { bookingid, roomid } = req.body;
	try {
		const booking = await Booking.findOne({ _id: bookingid });

		booking.status = "cancelled";
		await booking.save();
		const room = await Room.findOne({ _id: roomid });
		const bookings = room.currentbookings;
		const temp = bookings.filter((x) => x.bookingid.toString() !== bookingid);
		room.currentbookings = temp;
		await room.save();

		res.send("Your booking cancelled successfully");
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error });
	}
});

router.post("/getbookingbyuserid", async (req, res) => {
	const { userid } = req.body;
	try {
		const bookings = await Booking.find({ userid: userid });

		res.send(bookings);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error });
	}
});
router.post("/bookroom", async (req, res) => {
	try {
		const { room, userid, fromdate, todate, totalAmount, totaldays, token } =
			req.body;

		// Convert dates to a consistent format
		const formattedFromDate = moment(fromdate, "DD-MM-YYYY");
		const formattedToDate = moment(todate, "DD-MM-YYYY");
		const roomData = await Room.findOne({ _id: room._id });

		const isAlreadyBooked = roomData.currentbookings.some((booking) => {
			const existingFromDate = moment(booking.fromdate, "DD-MM-YYYY");
			const existingToDate = moment(booking.todate, "DD-MM-YYYY");

			// Check if dates overlap
			return (
				formattedFromDate.isBetween(
					existingFromDate,
					existingToDate,
					undefined,
					"[]"
				) ||
				formattedToDate.isBetween(
					existingFromDate,
					existingToDate,
					undefined,
					"[]"
				) ||
				existingFromDate.isBetween(
					formattedFromDate,
					formattedToDate,
					undefined,
					"[]"
				) ||
				existingToDate.isBetween(
					formattedFromDate,
					formattedToDate,
					undefined,
					"[]"
				)
			);
		});

		// If room is already booked in the specified date range, send an error response
		if (isAlreadyBooked) {
			return res
				.status(400)
				.json({ message: "Room is already booked for the selected dates." });
		}

		try {
			// Create customer (Payment Section)
			// const customer = await stripe.customers.create({
			//   email: token.email,
			//   source: token.id,
			// });

			// Charge payment (Payment Section)
			// const payment = await stripe.charges.create(
			//   {
			//     amount: totalAmount * 100,
			//     customer: customer.id,
			//     currency: "USD",
			//     receipt_email: token.email,
			//   },
			//   {
			//     idempotencyKey: uuidv4(),
			//   }
			// );

			// Payment success (Payment Section)
			// if (payment) {

			// Proceed with booking room
			const newBooking = new Booking({
				room: room.name,
				roomid: room._id,
				userid,
				fromdate: moment(fromdate).format("DD-MM-YYYY"),
				todate: moment(todate).format("DD-MM-YYYY"),
				totalamount: totalAmount,
				totaldays,
				transactionid: uuidv4(), // Generate transaction ID even if no payment
			});

			// Save booking
			const booking = await newBooking.save();

			// Update room's current bookings
			const roomTmp = await Room.findOne({ _id: room._id });
			roomTmp.currentbookings.push({
				bookingid: booking._id,
				fromdate: formattedFromDate.format("DD-MM-YYYY"),
				todate: formattedToDate.format("DD-MM-YYYY"),
				userid: userid,
				status: booking.status,
			});

			await roomTmp.save();
			res.send("Booking successful. Your room is reserved.");

			// } // End of payment success check (Payment Section)
		} catch (error) {
			return res.status(400).json({ message: error });
		}
	} catch (error) {
		return res.status(400).json({ message: error });
	}
});

module.exports = router;

module.exports = router;
