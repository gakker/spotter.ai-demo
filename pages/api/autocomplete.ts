import axios from "axios";
import { GOOGLE_API_KEY } from "../../config";

export default async function handler(req: Request | any, res: Response | any) {
  if (req.method === "GET") {
    const { query } = req.query;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            key: GOOGLE_API_KEY,
          },
        }
      );

      if (response.data.predictions) {
        res.status(200).json(response.data.predictions);
      } else {
        res.status(404).json({ error: "No predictions found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data from Google API" });
    }
  } else {
    // Method Not Allowed
    res.status(405).json({ error: "Method not allowed" });
  }
}
