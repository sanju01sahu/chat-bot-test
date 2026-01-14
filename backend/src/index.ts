import express from "express";
import { getCompanies } from "./controllers/getCompany.js";
// import { testDbConnection } from "./config/dbConfig.js";
import { getCallsData } from "./middlewares/getCallsData.js";
import { generateCallReport, generateVisitReport } from "./controllers/chatBot.js";
import { getVisitsData } from "./middlewares/getVisitData.js";
import cors from 'cors'
import { getCompanyData } from "./controllers/getCompanyData.js";
// const express = require('express');

const app = express();
const PORT = 9090;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// testDbConnection();
app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Nodemon!");
});

app.get("/companies", getCompanies);
app.get("/get-company-data", getCompanyData)
app.post('/summary-calls', getCallsData, generateCallReport);
app.post('/summary-visits', getVisitsData, generateVisitReport);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


