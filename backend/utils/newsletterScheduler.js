const cron = require('node-cron');
const newsletterController = require('../controllers/newsletter.controller');
const newsletterModel = require('../models/newsletter.model');
const emailService = require('../services/email.service');
const { getDb } = require('../db/mongo');

function startNewsletterScheduler() {
  /* scheduler:
  '* * * * *' --> every minutes
  '0 8 * * *' --> every day 8:00
  '0 *@6 * * *' --> 6 hourly !!! change @ to / !!!!
  '0 *@1 * * *' --> 1 hourly !!! change @ to / !!!!
  '0 0 * * *' --> every day midnight
  */
  cron.schedule('0 */1 * * *', async () => {
    const now = new Date();
    console.log(`[CRON] Checking for newsletters to send at ${now.toISOString()}`);
    try {
        const newsletters = await newsletterModel.getDueNewsletters(now);
        console.log(`[CRON} number of newsletters to send:"${newsletters.length}"`);
        for (const newsletter of newsletters) {
            const subscribers = newsletter.subscribers;
            const template = await getDb().collection('newsletters').findOne({ _id: newsletter.templateId });
            const rawcontent = template.rawcontent;
            console.log(`[CRON] "${newsletter.subject}"The newsletter has to send for "${subscribers.length}" number of subscribers.`);
            for (const subscriber of subscribers) {
                const content = newsletterController.fillTemplate(rawcontent, {
                    firstname: subscriber.firstname,
                    name: subscriber.name,
                    email: subscriber.email
                });
                console.log(`The subscriber: "${subscriber.email}" will get the newsletter:"${newsletter.subject}".`);
                try{
                    await emailService.sendHtml(subscriber.email, newsletter.subject, content);
                } catch (err) {
                    console.error('[CRON] Error during newsletter dispatch:', err);
                }
            };
            await newsletterModel.markAsSent(newsletter._id);
            console.log(`[CRON] Newsletter "${newsletter.subject}" sent and marked as sent.`);
        };
    } catch (err) {
        console.error('[CRON] Error during get due newsletters:', err);
    }
})};

module.exports = {
    startNewsletterScheduler
};