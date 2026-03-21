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
  if(!fare) {
    fare = await Fare.create({ p: 10, q: 20, r: 30, s: 40, t: 50 });
  }
  return fare;
}

export const validateExit = async (req, res) => {
  try {
    const { qrToken, exitStation } = req.body;

    if (!qrToken || !exitStation) {
      return res.status(400).json({
        message: "qrToken and exitStation are required"
      });
    }

    const ticket = await Ticket.findOne({ qrToken });
    if (!ticket) {
      return res.status(404).json({
        valid: false,
        message: "Ticket not found"
      });
    }

    if (ticket.status === "USED") {
      return res.status(400).json({
        valid: false,
        message: "This QR has already been used"
      });
    }

    const route = await Route.findById(ticket.routeId);
    if (!route) {
      return res.status(404).json({
        valid: false,
        message: "Route not found"
      });
    }

    const bookedDestIdx = route.stations.indexOf(ticket.destination);
    const exitIdx = route.stations.indexOf(exitStation);

    if (exitIdx === -1) {
      return res.status(400).json({
        valid: false,
        message: "Exit station not on this route"
      });
    }

    // user went beyond booked destination
    if (exitIdx > bookedDestIdx) {
      const fareDoc = await getFareDoc();
      const extraStops = exitIdx - bookedDestIdx;
      const extraFare = computeFareByStops(extraStops, fareDoc);

      return res.status(409).json({
        valid: false,
        extraRequired: true,
        message: `Extra fare required from ${ticket.destination} to ${exitStation}`,
        extraTrip: {
          parentTicketId: ticket._id,
          routeId: route._id,
          routeName: route.routeName,
          source: ticket.destination,
          destination: exitStation,
          stops: extraStops,
          fare: extraFare
        }
      });
    }

    // valid exit: exact or earlier
    ticket.status = "USED";
    ticket.usedAt = new Date();
    await ticket.save();

    return res.status(200).json({
      valid: true,
      message: `Exit allowed at ${exitStation}`,
      ticket
    });
  } catch (error) {
    console.error("validateExit error:", error);
    return res.status(500).json({
      valid: false,
      message: "Server error"
    });
  }
};