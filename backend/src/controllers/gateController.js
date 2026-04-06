import Ticket from "../models/ticket.js";
import Route from "../models/route.js";
import Fare from "../models/fare.js";
import Station from "../models/station.js";

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

export const scanTicket = async (req, res) => {
  try {
    const { qrToken, station } = req.body;

    if (!qrToken || !station) {
      return res.status(400).json({
        success: false,
        message: "qrToken and station required"
      });
    }

    const ticket = await Ticket.findOne({ qrToken });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Invalid Ticket"
      });
    }

    // ❌ Already used
    if (ticket.status === "USED") {
      return res.json({
        success: false,
        message: "Ticket already used"
      });
    }

    // 🔥 GET STATIONS
    const currentStation = await Station.findOne({ name: station });
    const sourceStation = await Station.findOne({ name: ticket.source });
    const destStation = await Station.findOne({ name: ticket.destination });

    if (!currentStation || !sourceStation || !destStation) {
      return res.status(400).json({
        success: false,
        message: "Invalid station data"
      });
    }

    // 🟢 ENTRY
   if (!ticket.first_scan_at) {

  // ❌ wrong station → reject immediately
  if (station !== ticket.source) {
    return res.json({
      success: false,
      message: `Entry allowed only at ${ticket.source}`
    });
  }

  // 🔥 atomic update (prevents duplicate entry)
  const updatedTicket = await Ticket.findOneAndUpdate(
    { qrToken, first_scan_at: null },
    { first_scan_at: station },
    { new: true }
  );

  if (!updatedTicket) {
    return res.json({
      success: false,
      message: "Ticket already entered"
    });
  }

  return res.json({
    success: true,
    type: "ENTRY",
    message: `Entry allowed at ${station}`
  });
}

    // 🔵 EXIT
    if (!ticket.second_scan_at) {

      // 🔥 CHECK SAME LINE
      if (currentStation.line !== sourceStation.line) {
        return res.json({
          success: false,
          message: "Invalid line for this ticket"
        });
      }

      // 🔥 CHECK BETWEEN RANGE
      const minOrder = Math.min(sourceStation.order, destStation.order);
      const maxOrder = Math.max(sourceStation.order, destStation.order);

      if (
        currentStation.order < minOrder ||
        currentStation.order > maxOrder
      ) {
        return res.json({
          success: false,
          message: "Exit not allowed at this station"
        });
      }

      // ✅ VALID EXIT
      ticket.second_scan_at = station;
      ticket.status = "USED";
      ticket.usedAt = new Date();

      await ticket.save();

      return res.json({
        success: true,
        type: "EXIT",
        message: `Exit allowed at ${station}`
      });
    }

    return res.json({
      success: false,
      message: "Invalid scan attempt"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};