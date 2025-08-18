// Template for the footer of the newsletter
export const footerHTML = `
<div class="footer" style="background-color: #f8f8f8; padding: 20px; text-align: center; font-family: Arial, sans-serif; color: #555; font-size: 14px;">
<p style="margin: 0 0 10px 0; color: #333;">Kedves {{firstname}} köszönöm, hogy engem választottál!</p>
<p style="margin: 0 0 15px 0;">Antali Gyöngyi • <a href="mailto:info@yowayoli.com" style="color: #0077cc; text-decoration: none;">info@yowayoli.com</a></p>
<div style="display: inline-block; margin-top: 10px;">
<a href="https://antaligyongyi.hu" style="margin: 0 10px; color: #0077cc; text-decoration: none;">Weboldal</a> |
<a href="https://www.facebook.com/profile.php?id=100064353450604" style="margin: 0 10px; color: #0077cc; text-decoration: none;">Facebook</a> |
<a href="https://www.instagram.com/antaligyongyiedit/" style="margin: 0 10px; color: #0077cc; text-decoration: none;">Instagram</a> |
<a href="https://antaligyongyi.hu/gdpr" style="margin: 0 10px; color: #0077cc; text-decoration: none;">GDPR</a> |
<a href="https://antaligyongyi.hu/api/unsubscribe/{{email}}" style="margin: 0 10px; color: #0077cc; text-decoration: none;">Leiratkozás</a>
</div>
<img src="https://antaligyongyi.hu/api/track/open/{{sendingNr}}" width="1" height="1" style="display:none;" />
</div>
`