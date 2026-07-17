import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto('http://localhost:5173/services');
await page.evaluate(() => {
  localStorage.setItem('marafiq_auth_user', JSON.stringify({ name: 'Ahmed Ali', initials: 'AA', type: 'Personal Account', mobile: '+968 91234567' }));
});
await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
await page.waitForSelector('.dash-title', { timeout: 5000 });
await page.waitForTimeout(300);
await page.screenshot({ path: 'D:/netways/Marafiq-web2/_dash_top.png' });

await page.click('.dash-tab:nth-child(2)');
await page.waitForTimeout(150);

await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(150);
await page.screenshot({ path: 'D:/netways/Marafiq-web2/_dash_mid.png' });

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(150);
await page.screenshot({ path: 'D:/netways/Marafiq-web2/_dash_bottom.png' });

// check navbar link presence
const hasDashLink = await page.evaluate(() => !!document.querySelector('a[href="/dashboard"]'));
console.log('Dashboard nav link present:', hasDashLink);

console.log('CONSOLE ERRORS:', JSON.stringify(errors));
await browser.close();
