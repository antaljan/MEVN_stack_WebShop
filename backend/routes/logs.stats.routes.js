const express = require('express');
const router = express.Router();
const { client } = require('../db/mongo');

// Helper: dátum string → Date objektum
function parseDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

router.get('/stats', async (req, res) => {
  try {
    const db = client.db('yowayoli');
    const logs = db.collection('apiLogs');

    // Query paraméterek
    const { from, to } = req.query;

    const fromDate = parseDate(from) || new Date('2000-01-01');
    const toDate = parseDate(to) || new Date();

    // Időintervallum filter
    const matchStage = {
      timestamp: {
        $gte: fromDate,
        $lte: toDate
      }
    };

    // -----------------------------
    // 1) Napi request count
    // -----------------------------
    const dailyRequests = await logs.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }},
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 }}
    ]).toArray();

    // -----------------------------
    // 2) Napi egyedi látogatók
    // -----------------------------
    const dailyUniqueVisitors = await logs.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }},
          uniqueIps: { $addToSet: "$ip" }
        }
      },
      {
        $project: {
          _id: 1,
          uniqueVisitors: { $size: "$uniqueIps" }
        }
      },
      { $sort: { _id: 1 }}
    ]).toArray();

    // -----------------------------
    // 3) Top országok
    // -----------------------------
    const topCountries = await logs.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 }},
      { $limit: 10 }
    ]).toArray();

    // -----------------------------
    // 4) Top városok
    // -----------------------------
    const topCities = await logs.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 }},
      { $limit: 10 }
    ]).toArray();

    // -----------------------------
    // 5) Top IP címek
    // -----------------------------
    const topIps = await logs.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$ip",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 }},
      { $limit: 10 }
    ]).toArray();

    // -----------------------------
    // 6) Top URL-ek
    // -----------------------------
    const topUrls = await logs.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$url",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 }},
      { $limit: 10 }
    ]).toArray();

    // -----------------------------
    // 7) Top HTTP metódusok
    // -----------------------------
    const topMethods = await logs.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 }}
    ]).toArray();

    // Válasz
    res.json({
      from: fromDate,
      to: toDate,
      dailyRequests,
      dailyUniqueVisitors,
      topCountries,
      topCities,
      topIps,
      topUrls,
      topMethods
    });

  } catch (error) {
    console.error('Error in /logs/stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
