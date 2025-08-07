const cron = require('node-cron');
const newsletterController = require('../controllers/newsletter.controller');
const newsletterModel = require('../models/newsletter.model');


cron.schedule('* * * * *', async () => {
    const now = new Date();
    const newsletters = await newsletterModel.getDueNewsletters(now);

    for (const newsletter of newsletters) {
        const subscribers = await newsletterModel.getAllSubscribers();

        for (const subscriber of subscribers) {
            const content = newsletterController.fillTemplate(newsletter.rawcontent, {
                firstname: subscriber.firstname,
                name: subscriber.name,
                email: subscriber.email
            });
        await emailService.sendHtml(subscriber.email, newsletter.subject, content);
    }

    await newsletterModel.markAsSent(newsletter.id);
    console.log(`Newsletter "${newsletter.subject}" sent at ${now.toISOString()}`);
  }
});
