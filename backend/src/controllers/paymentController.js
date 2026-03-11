import Payment from "../models/payment.js";
import Ticket from "../models/tickets.js";

export const processPayment = async (req, res) => {

  try {

    const {
      source,
      destination,
      amount,
      cardNumber,
      cardHolder
    } = req.body;

    const random = Math.random();

    let status = "SUCCESS";

    if(random < 0.1){
      status = "FAILED";
    }

    
    const payment = await Payment.create({
      source,
      destination,
      amount,
      cardNumber,
      cardHolder,
      status,
      userId: req.user.id
    });

    if(status === "FAILED"){
      return res.status(400).json({
        message: "Payment Failed",
        payment
      });
    }

    // create ticket if payment success
    const ticket = await Ticket.create({
      source,
      destination,
      boughtBy: req.user.id
    });

    res.json({
      message: "Payment Successful",
      payment,
      ticket
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};