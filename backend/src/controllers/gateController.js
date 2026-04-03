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

    // 🟢 ENTRY SCAN
    if (!ticket.first_scan_at) {
      ticket.first_scan_at = station;

      await ticket.save();

      return res.json({
        success: true,
        type: "ENTRY",
        message: `Entry allowed at ${station}`
      });
    }

    // 🔵 EXIT SCAN
    if (!ticket.second_scan_at) {
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