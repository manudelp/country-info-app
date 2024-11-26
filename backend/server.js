require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;
const API = process.env.NAGER_API_BASE_URL;
const API2 = process.env.COUNTRIES_NOW_API_BASE_URL;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

app.get("/api/countries", async (req, res) => {
  try {
    const response = await axios.get(`${API}/AvailableCountries`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching countries");
  }
});

// API endpoint to retrieve country information
app.get("/api/countries/:countryCode", async (req, res) => {
  const countryCode = req.params.countryCode;

  try {
    // Country Name and Borders
    const countryInfo = await axios.get(`${API}/CountryInfo/${countryCode}`);
    const country = countryInfo.data.commonName;
    const borders = countryInfo.data.borders || [];

    // Population Data
    const populationResponse = await retryRequest(() =>
      axios.get(`${API2}/countries/population`)
    );
    const populationData = populationResponse.data.data || [];

    const populationDataForCountry = populationData.find(
      (data) => data.country.toLowerCase() === country.toLowerCase()
    );

    const filteredPopulationCounts = populationDataForCountry
      ? populationDataForCountry.populationCounts
      : null;

    if (!populationDataForCountry) {
      console.warn(`Population data for country ${country} not found.`);
    }

    // Flag URL
    const flagResponse = await retryRequest(() =>
      axios.get(`${API2}/countries/flag/images`)
    );
    const flagDataAll = flagResponse.data.data || [];

    const flagData = flagDataAll.find(
      (country) => country.iso2 === countryCode
    );

    const flagUrl = flagData ? flagData.flag : null;

    res.json({
      country,
      borders,
      populationData: filteredPopulationCounts,
      flagUrl,
    });
  } catch (error) {
    console.error("Error fetching country data:", error);

    if (error.response && error.response.status === 429) {
      return res.status(429).send("Too many requests");
    }

    res.status(500).send("Error fetching country data");
  }
});

async function retryRequest(requestFn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === retries - 1 || error.response?.status !== 429) {
        throw error;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
