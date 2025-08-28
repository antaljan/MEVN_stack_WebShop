const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');
const authenticateToken = require('../middleware/auth');

// Summarised statistics
router.get('/summary',authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const dailyLogs = await db.collection('apiLogs').aggregate([{
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$logData.timestamp" }
                },
                count: { $sum: 1 }
            }
            },
            { $sort: { _id: 1 } }
        ]).toArray();
        const oftenIps = await db.collection('apiLogs').aggregate([{
            $group: {
                _id: "$logData.ip",
                count: { $sum: 1 }
            }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();
        const oftenUrls = await db.collection('apiLogs').aggregate([{
            $group: {
                _id: "$logData.url",
                count: { $sum: 1 }
                }},
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();
        const oftenMethods = await db.collection('apiLogs').aggregate([{
            $group: {
                _id: "$logData.method",
                count: { $sum: 1 }
            }}
        ]).toArray();
        res.json({
            dailyLogs,
            oftenIps,
            oftenUrls,
            oftenMethods
        });
    } catch (err) {
        console.error('Summary error:', err);
        res.status(500).json({ error: 'Nem sikerült lekérni az összesítést.' });
    }
});

module.exports = router;
