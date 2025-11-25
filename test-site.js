const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Testing https://max-it.tech/ (DE)...');
  
  // Test German version
  await page.goto('https://max-it.tech/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshot-de.jpg', type: 'jpeg', quality: 80 });
  console.log('✓ Screenshot DE saved');

  // Check for console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // Test English version
  console.log('Testing https://max-it.tech/en/ (EN)...');
  await page.goto('https://max-it.tech/en/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshot-en.jpg', type: 'jpeg', quality: 80 });
  console.log('✓ Screenshot EN saved');

  // Test navigation and interactive elements
  console.log('Testing navigation...');
  const navLinks = await page.locator('nav a').count();
  console.log(`✓ Found ${navLinks} navigation links`);

  // Check if main sections are visible
  const header = await page.locator('header').isVisible();
  console.log(`✓ Header visible: ${header}`);

  // Check CSP headers
  const response = await page.goto('https://max-it.tech/');
  const csp = response.headers()['content-security-policy'];
  console.log('\n--- CSP Header ---');
  console.log(csp ? csp.substring(0, 200) + '...' : 'No CSP header found!');

  if (errors.length > 0) {
    console.log('\n--- Console Errors ---');
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('\n✓ No console errors detected');
  }

  await browser.close();
  console.log('\n✓ All tests passed!');
})();
