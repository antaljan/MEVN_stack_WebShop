const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');
const authenticateToken = require('../middleware/auth');


// 📊 Összesített statisztikák
router.get('/summary',authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const totalNewsletters = await db.collection('schedulednewsletters').countDocuments();
        const totalSubscribers = await db.collection('scheduledNewsletters').aggregate([
            { $unwind: '$subscribers' },
            { $count: 'count' }
        ]).toArray();
        const totalOpened = await db.collection('emailEvents').countDocuments({ openedAt: { $exists: true } });
        const totalClicks = await db.collection('emailEvents').aggregate([
            { $unwind: '$clicks' },
            { $count: 'count' }
        ]).toArray();
        res.json({
            totalNewsletters,
            totalSubscribers: totalSubscribers[0]?.count || 0,
            totalOpened,
            totalClicks: totalClicks[0]?.count || 0
        });
    } catch (err) {
        console.error('Summary error:', err);
        res.status(500).json({ error: 'Nem sikerült lekérni az összesítést.' });
    }
});

// 📋 Kampány részletező
router.get('/campaigns',authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const campaigns = await db.collection('schedulednewsletters').find().toArray();
        const results = await Promise.all(campaigns.map(async campaign => {
            const newsletterId = campaign._id.toString();
            const subscriberCount = campaign.subscribers.length;
            const openedCount = await db.collection('emailEvents').countDocuments({
                emailId: { $regex: `^${newsletterId}_` },
                openedAt: { $exists: true }
            });
            const clickCount = await db.collection('emailEvents').aggregate([
                { $match: { emailId: { $regex: `^${newsletterId}_` } } },
                { $unwind: '$clicks' },
                { $count: 'count' }
            ]).toArray();
            const topClick = await db.collection('emailEvents').aggregate([
                { $match: { emailId: { $regex: `^${newsletterId}_` } } },
                { $unwind: '$clicks' },
                { $group: { _id: '$clicks.url', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]).toArray();
            return {
                subject: campaign.subject,
                sendDate: campaign.sendDate,
                openRate: ((openedCount / subscriberCount) * 100).toFixed(1),
                clickRate: ((clickCount[0]?.count || 0) / subscriberCount * 100).toFixed(1),
                topLink: topClick[0]?._id || 'Nincs kattintás'
            };
        }));
        res.json(results);
    } catch (err) {
        console.error('Summary error:', err);
        res.status(500).json({ error: 'Nem sikerült lekérni az összesítést.' });
    }
});

module.exports = router;
