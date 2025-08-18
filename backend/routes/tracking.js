const express = require('express')
const router = express.Router()
const { getDb } = require('../db/mongo');

router.get('/open/:emailId',async (req, res) => {
  const emailId = req.params.emailId
  const userAgent = req.headers['user-agent']
  const timestamp = new Date()

  // Itt logoljuk az eseményt (később adatbázisba mentjük)
  console.log(`Email opened: ${emailId} at ${timestamp} from ${userAgent}`)
    await getDb().collection('emailEvents').updateOne(
    { emailId },
    { $set: { openedAt: timestamp } },
    { upsert: true }
    );

  // Átlátszó pixel visszaküldése
  const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    'base64'
  )
  res.set('Content-Type', 'image/gif')
  res.send(pixel)
})

router.get('/click/:emailId',async  (req, res) => {
  const emailId = req.params.emailId
  const targetUrl = req.query.url
  const timestamp = new Date()

  if (!targetUrl) {
    return res.status(400).send('Missing target URL')
  }

  // Itt logoljuk az eseményt (később adatbázisba mentjük)
  console.log(`Email clicked: ${emailId} → ${targetUrl} at ${timestamp}`)
  await getDb().collection('emailEvents').updateOne(
    { emailId },
    { $push: { clicks: { url: targetUrl, timestamp } } },
    { upsert: true }
  );

  // Továbbirányítás a céloldalra
  res.redirect(targetUrl)
})


module.exports = router
