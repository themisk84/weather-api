import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const SMHI_API_URL =
  "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.0717/lat/59.3269/data.json";

let weatherForecast = [];

const getData = async () => {
  const response = await fetch(SMHI_API_URL);
  const data = await response.json();

  weatherForecast = data.timeSeries.map((item) => ({
    time: item.validTime,
    parameters: item.parameters
      .map((parameter) => ({
        name: parameter.name,
        unit: parameter.unit,
        value: parameter.values,
      }))
      .filter(
        (element) =>
          element.name === "t" ||
          element.name === "Wsymb2" ||
          element.name === "wd" ||
          element.name === "ws" ||
          element.name === "pcat"
      ),
  }));
};

getData();

app.get("/", async (req, res) => {
  res.send(weatherForecast);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
