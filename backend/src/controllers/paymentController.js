import crypto from "crypto";
import QRCode from "qrcode";

import Payment from "../models/payment.js";
import Ticket from "../models/ticket.js";
import Route from "../models/route.js";
import Fare from "../models/fare.js";

function computeFareByStops(stops, fareDoc) {
  if (stops <= 3) return fareDoc.p;
  if (stops <= 6) return fareDoc.q;
  if (stops <= 9) return fareDoc.r;
  if (stops <= 12) return fareDoc.s;
  return fareDoc.t;
}

async function getFareDoc() {
  let fare = await Fare.findOne();
  if (!fare) {
    fare = await Fare.create({ p: 10, q: 20, r: 30, s: 40, t: 50 });
  }
  return fare;
}

function isValidCardNumber(cardNumber) {
  return /^\d{16}$/.test(cardNumber);
}

function simulatePayment() {
  return Math.random() < 0.95; // 95% success
}

export const processPayment = async (req, res) => {
  try {
    const {
      routeId,
      routeName,
      source,
      destination,
      cardNumber,
      cardHolder,
      cvv
    } = req.body;

    if (!routeId || !routeName || !source || !destination || !cardNumber || !cardHolder || !cvv) {
      return res.status(400).json({
        message: "All payment fields are required"
      });
    }

    if (!isValidCardNumber(cardNumber)) {
      return res.status(400).json({
        message: "Card number must be 16 digits"
      });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const sIdx = route.stations.indexOf(source);
    const dIdx = route.stations.indexOf(destination);

    if (sIdx === -1 || dIdx === -1 || dIdx === sIdx) {
      return res.status(400).json({
        message: "Invalid source/destination for this route"
      });
    }

    const stops = Math.abs(dIdx - sIdx);
    const fareDoc = await getFareDoc();
    const amount = computeFareByStops(stops, fareDoc);

    const paymentSuccess = simulatePayment();

    const payment = await Payment.create({
      source,
      destination,
      amount,
      cardNumber,
      cardHolder,
      cvv,
      status: paymentSuccess ? "SUCCESS" : "FAILED",
      userId: req.user.id
    });

    if (!paymentSuccess) {
      return res.status(400).json({
        message: "Payment Failed",
        payment
      });
    }

    const qrToken = crypto.randomUUID();

    const FRONTEND_BASE_URL =
      process.env.FRONTEND_BASE_URL || "http://localhost:5173";

    const scanUrl = `${FRONTEND_BASE_URL}/customer/scan/${qrToken}`;

    const qrCodeDataUrl = await QRCode.toDataURL(scanUrl);

    const ticket = await Ticket.create({
      source,
      destination,
      routeId,
      routeName,
      farePaid: amount,
      boughtBy: req.user.id,
      qrToken,
      scanUrl,
      qrCodeDataUrl,
      status: "ACTIVE"
    });

    return res.status(200).json({
      message: "Payment Successful",
      payment,
      ticket
    });

  } catch (error) {
    console.error("processPayment error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

export const processExtraFarePayment = async (req, res) => {
  try {
    const {
      parentTicketId,
      routeId,
      routeName,
      source,
      destination,
      cardNumber,
      cardHolder,
      cvv
    } = req.body;

    if (!parentTicketId || !routeId || !routeName || !source || !destination || !cardNumber || !cardHolder || !cvv) {
      return res.status(400).json({
        message: "All extra fare fields are required"
      });
    }

    if (!isValidCardNumber(cardNumber)) {
      return res.status(400).json({
        message: "Card number must be 16 digits"
      });
    }

    const parentTicket = await Ticket.findById(parentTicketId);
    if (!parentTicket) {
      return res.status(404).json({ message: "Original ticket not found" });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const sIdx = route.stations.indexOf(source);
    const dIdx = route.stations.indexOf(destination);

    if (sIdx === -1 || dIdx === -1 || dIdx === sIdx) {
      return res.status(400).json({ message: "Invalid extra trip" });
    }

    const stops = Math.abs(dIdx - sIdx);
    const fareDoc = await getFareDoc();
    const amount = computeFareByStops(stops, fareDoc);

    const paymentSuccess = simulatePayment();

    const payment = await Payment.create({
      source,
      destination,
      amount,
      cardNumber,
      cardHolder,
      cvv,
      status: paymentSuccess ? "SUCCESS" : "FAILED",
      userId: req.user.id
    });

    if (!paymentSuccess) {
      return res.status(400).json({
        message: "Payment Failed",
        payment
      });
    }

    parentTicket.status = "USED";
    parentTicket.usedAt = new Date();
    await parentTicket.save();

    const qrToken = crypto.randomUUID();

    const FRONTEND_BASE_URL =
      process.env.FRONTEND_BASE_URL || "http://localhost:5173";

    const scanUrl = `${FRONTEND_BASE_URL}/customer/scan/${qrToken}`;

    const qrCodeDataUrl = await QRCode.toDataURL(scanUrl);

    const ticket = await Ticket.create({
      source,
      destination,
      routeId,
      routeName,
      farePaid: amount,
      boughtBy: req.user.id,
      qrToken,
      scanUrl,
      qrCodeDataUrl,
      status: "ACTIVE",
      parentTicketId: parentTicket._id
    });

    return res.status(200).json({
      message: "Extra fare paid successfully",
      payment,
      ticket
    });

  }
  catch (error){
    console.error("processExtraFarePayment error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};