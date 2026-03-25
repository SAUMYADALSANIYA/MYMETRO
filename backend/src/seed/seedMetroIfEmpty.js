import Route from "../models/route.js";

export const seedMetroIfEmpty = async () => {
  try {
    const routeCount = await Route.countDocuments();
    
    if (routeCount > 0) {
      console.log("Metro data already exists, skipping automatic seed.");
      return;
    }

    console.log("Database empty. Please run 'node src/seed/seedMetroData.js' to populate Ahmedabad data.");
  } catch (error) {
    console.error("Metro seeding error:", error);
  }
};