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
    // Fetch border countries
    const countryInfo = await axios.get(`${API}/CountryInfo/${countryCode}`);
    const country = countryInfo.data.commonName;
    const borders = countryInfo.data.borders || [];

    // Fetch population data
    const populationResponse = await axios.get(`${API2}/countries/population`);
    const populationData = populationResponse.data.data || [];

    // Find population data for the requested country
    const populationDataForCountry = populationData.find(
      (data) => data.country.toLowerCase() === country.toLowerCase()
    );

    if (!populationDataForCountry) {
      throw new Error(`Population data for country ${country} not found.`);
    }

    const filteredPopulationCounts = populationDataForCountry.populationCounts;

    // Fetch flag data
    const flagResponse = await axios.get(`${API2}/countries/flag/images`);
    const flagDataAll = flagResponse.data.data || [];

    // Find the flag for the requested countryCode
    const flagData = flagDataAll.find(
      (country) => country.iso2 === countryCode
    );

    if (!flagData) {
      throw new Error(`Flag data for country code ${countryCode} not found.`);
    }

    const flagUrl = flagData.flag;

    // Return the consolidated data
    res.json({
      country,
      borders,
      populationData: filteredPopulationCounts,
      flagUrl,
    });
  } catch (error) {
    console.error("Error fetching country data:", error);
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
