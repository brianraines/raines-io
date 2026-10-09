const { test, expect } = require('@playwright/test');
const { readFile } = require('node:fs/promises');

test.beforeEach(async ({ page, baseURL }) => {
  // Keep local behavior real; avoid analytics collection and external font outages.
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(baseURL).origin) {
      return route.continue();
    }
    return route.fulfill({ status: 200, body: '' });
  });
});

test('site initializes without JavaScript errors or failed local requests', async ({ page, baseURL }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.url().startsWith(baseURL) && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(baseURL)) errors.push(`Failed: ${request.url()}`);
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Brian Raines', level: 1 })).toBeVisible();
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  await expect(page.getByRole('region', { name: 'Testimonials carousel' })).toHaveClass(/swiper-initialized/);
  await page.getByRole('region', { name: 'About me' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('region', { name: 'About me' }).getByRole('img')).toBeVisible();
  await expect.poll(() => page.getByRole('region', { name: 'About me' }).getByRole('img')
    .evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(errors).toEqual([]);
});

test('navigation reaches every advertised section on desktop and mobile', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  const navigation = page.getByRole('navigation');
  const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
  if (isMobile) {
    await expect(navigation.getByRole('link', { name: 'About', exact: true })).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  }
  const destinations = [
    ['About', 'about', 'About me'],
    ['Skills', 'skill', 'Technical Expertise'],
    ['Resume', 'resume', 'Experience'],
    ['Projects', 'projects', 'Projects'],
    ['Feedback', 'feedback', 'What People Say'],
    ['Contact', 'contact', 'Contact'],
  ];
  for (const [name, fragment, heading] of destinations) {
    await navigation.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${fragment}$`));
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeInViewport();
  }
  await navigation.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Brian Raines', level: 1 })).toBeInViewport();
  if (isMobile) {
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(navigation.getByRole('link', { name: 'About', exact: true })).toBeHidden();
  }
});

test('hero and contact table describe Brian as an Engineer & Architect', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  const hero = page.getByRole('banner');
  await expect(hero.getByRole('heading', { name: 'Brian Raines', level: 1 })).toBeVisible();
  await expect(hero.getByText('Engineer & Architect', { exact: true })).toBeVisible();
  const role = page.locator('.about .table tr', { hasText: 'Role' });
  await expect(role).toContainText('Engineer & Architect');
});

test('every rotating hero image is a web-sized image', async ({ page }) => {
  const heroResponses = new Map();
  page.on('response', async (response) => {
    if (/\/img\/hero\//.test(response.url())) {
      heroResponses.set(response.url(), { status: response.status(), type: response.headers()['content-type'], bytes: (await response.body()).length });
    }
  });
  // Cycle through all nine images instead of relying on chance.
  await page.addInitScript(() => {
    let calls = 0;
    Math.random = () => ((calls++ % 9) + 0.5) / 9;
  });
  await page.clock.install();
  await page.goto('/');
  for (let tick = 0; tick < 12; tick++) {
    await page.clock.runFor(5000);
  }
  await expect.poll(() => heroResponses.size, { timeout: 15000 }).toBe(9);
  for (const [url, { status, type, bytes }] of heroResponses) {
    expect(status, url).toBe(200);
    expect(type, url).toMatch(/^image\//);
    expect(bytes, `${url} should stay under 600 KB`).toBeLessThan(600 * 1024);
  }
});

test('every about-photo option is a small, served image', async ({ request }) => {
  for (let number = 1; number <= 11; number++) {
    const response = await request.get(`/img/bulldog/${number}.png`);
    expect(response.ok(), `bulldog ${number}`).toBe(true);
    expect((await response.body()).length, `bulldog ${number} should stay under 300 KB`).toBeLessThan(300 * 1024);
  }
});

test('about section tells visitors which roles Brian is open to', async ({ page }) => {
  await page.goto('/#about');
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  const about = page.getByRole('region', { name: 'About me', exact: true });
  const openTo = about.locator('p', { hasText: /open to/i });
  await expect(openTo).toBeVisible();
  for (const role of ['Staff', 'Principal', 'Distinguished', 'management']) {
    await expect(openTo).toContainText(role);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('quality and leadership cards share a row on desktop and stack on mobile', async ({ page, isMobile }) => {
  await page.goto('/#skill');
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  const skills = page.getByRole('region', { name: 'Technical Expertise', exact: true });
  const qualityHeading = skills.getByRole('heading', { name: 'Quality & Reliability', exact: true });
  await expect(qualityHeading).toBeVisible();
  const quality = skills.locator('.card-skill').filter({
    has: page.getByRole('heading', { name: 'Quality & Reliability', exact: true }),
  });
  const leadership = skills.locator('.card-skill').filter({
    has: page.getByRole('heading', { name: 'Technical Leadership', exact: true }),
  });
  const qualityBox = await quality.boundingBox();
  const leadershipBox = await leadership.boundingBox();
  if (isMobile) {
    expect(qualityBox.y).toBeGreaterThanOrEqual(leadershipBox.y + leadershipBox.height);
    expect(Math.abs(qualityBox.x - leadershipBox.x)).toBeLessThan(1);
  } else {
    expect(qualityBox.x).toBeGreaterThanOrEqual(leadershipBox.x + leadershipBox.width);
    expect(Math.abs(qualityBox.y - leadershipBox.y)).toBeLessThan(1);
    expect(Math.abs(qualityBox.height - leadershipBox.height)).toBeLessThan(1);
  }
  expect(await quality.evaluate((card) => card.scrollWidth <= card.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('projects follow the resume in the reading and navigation order', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  if (isMobile) await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
  const order = await page.getByRole('region', { name: 'Experience', exact: true })
    .evaluate((section) => section.nextElementSibling.id);
  expect(order).toBe('projects');
  const links = await page.getByRole('navigation').getByRole('link').allTextContents();
  expect(links.indexOf('Projects')).toBe(links.indexOf('Resume') + 1);
});

for (const fragment of ['feedback', 'clients']) {
  test(`direct #${fragment} link reaches the recommendations`, async ({ page }) => {
    await page.goto(`/#${fragment}`);
    await expect(page.locator('.preloader-wrap')).toBeHidden();
    await expect(page.getByRole('heading', { name: 'What People Say', exact: true })).toBeInViewport();
  });
}

test('workflow gate explanations have room to read without clipping', async ({ page }) => {
  await page.goto('/#projects');
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  const article = page.getByRole('article', { name: 'Robot Bakery', exact: true });
  await article.locator('summary').click();
  const workflow = article.getByRole('list', { name: 'Robot Bakery development workflow' });
  const bounds = await workflow.boundingBox();
  for (const explanation of await workflow.locator('span').all()) {
    const box = await explanation.boundingBox();
    // Captions need a useful reading measure rather than a narrow tile column.
    expect(box.width).toBeGreaterThanOrEqual(Math.min(260, bounds.width - 48));
    expect(await explanation.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  }
});

test('project technical notes work with pointer and keyboard', async ({ page }) => {
  await page.goto('/#projects');
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  for (const name of [
    'Robot Bakery',
    'Zero Touch Lease',
    'Paper to Digital',
    'AI Support Skills',
  ]) {
    const article = page.getByRole('article', { name, exact: true });
    // Native summary is exposed as a group by Chromium, so scope its visible control directly.
    const disclosure = article.locator('summary').filter({ hasText: 'Technical notes' });
    const contribution = article.getByRole('heading', { name: 'My contribution', exact: true });
    await expect(contribution).toBeHidden();
    await expect(disclosure).toBeVisible();
    await disclosure.click();
    await expect(contribution).toBeVisible();
    await disclosure.focus();
    await page.keyboard.press('Enter');
    await expect(contribution).toBeHidden();
    await page.keyboard.press('Space');
    await expect(contribution).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('structured profile represents the current employer and AI expertise', async ({ page }) => {
  await page.goto('/');
  const profiles = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent)));
  const person = profiles.find((profile) => profile['@type'] === 'Person');
  expect(person.jobTitle).toBe('Software Engineer');
  expect(person.worksFor.name).toBe('Property Vista');
  for (const subjects of [person.knowsAbout, person.hasOccupation.skills]) {
    expect(subjects).toEqual(expect.arrayContaining([
      expect.stringMatching(/Agentic SDLC/i),
      expect.stringMatching(/Model Context Protocol/i),
      expect.stringMatching(/Persistent agent memory/i),
      expect.stringMatching(/Test-driven development/i),
    ]));
  }
});

test('Brandon Morrill recommendation displays a usable portrait and consistent attribution', async ({ page }) => {
  const start = new Date('2026-10-08T12:00:00Z');
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  await page.goto('/#feedback');
  await page.clock.runFor(3000);
  await expect(page.locator('.preloader-wrap')).toBeHidden();
  const carousel = page.getByRole('region', { name: 'Testimonials carousel' });
  const portrait = carousel.getByRole('img', { name: /Brandon Morrill/ });
  await carousel.scrollIntoViewIfNeeded();
  await expect(portrait).toBeInViewport();
  await expect.poll(() => portrait.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  const recommendation = carousel.getByRole('blockquote').filter({
    has: page.getByRole('heading', { name: /Brandon Morrill/ }),
  });
  await expect(recommendation).toHaveAttribute('cite', /^https:\/\/www\.linkedin\.com\/in\/brian-raines-0669913\/details\/recommendations\//);
  const profiles = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent)));
  const review = profiles.find((profile) => profile['@type'] === 'ItemList').itemListElement
    .find((item) => item.author.name === 'Brandon Morrill');
  expect(review).toBeDefined();
  await expect(recommendation.getByRole('heading')).toHaveText(
    `${review.author.name} — ${review.author.jobTitle}, ${review.author.worksFor.name}`);
  expect((await recommendation.locator('p').innerText()).replace(/^"|"$/g, '')).toBe(review.reviewBody);
  expect(review.url).toBe(await recommendation.getAttribute('cite'));
  expect(review.reviewRating).toBeUndefined(); // LinkedIn recommendations do not supply a star rating.
});

test('recommendation cards open the LinkedIn recommendations in a new tab', async ({ page, context }) => {
  const destination = 'https://www.linkedin.com/in/brian-raines-0669913/details/recommendations';
  // Verify the destination without depending on LinkedIn authentication or availability.
  await context.route(destination, (route) => route.fulfill({ body: '<title>Recommendations destination</title>' }));
  const start = new Date('2026-10-08T12:00:00Z');
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  await page.goto('/#feedback');
  await page.clock.runFor(3000);
  const carousel = page.getByRole('region', { name: 'Testimonials carousel' });
  const links = carousel.getByRole('link', { name: /Read recommendation by .+ on LinkedIn/ });
  await expect(links).toHaveCount(await carousel.getByRole('blockquote').count());
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', destination);
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('aria-label', /opens in a new tab/);
  }
  await carousel.scrollIntoViewIfNeeded();
  const opened = page.waitForEvent('popup');
  await links.first().getByRole('img').click();
  const popup = await opened;
  await expect(popup).toHaveURL(destination);
  await expect(page).toHaveURL(/#feedback$/);
});

test('recommendation cards remain visible while using the keyboard', async ({ page, context }) => {
  const destination = 'https://www.linkedin.com/in/brian-raines-0669913/details/recommendations';
  await context.route(destination, (route) => route.fulfill({ body: '<title>Recommendations destination</title>' }));
  const start = new Date('2026-10-08T12:00:00Z');
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  await page.goto('/#feedback');
  await page.clock.runFor(3000);
  const carousel = page.getByRole('region', { name: 'Testimonials carousel' });
  const links = carousel.getByRole('link', { name: /Read recommendation by .+ on LinkedIn/ });
  await expect(links).toHaveCount(await carousel.getByRole('blockquote').count());
  await links.first().focus();
  for (const link of await links.all()) {
    await expect(link).toBeFocused();
    await page.clock.runFor(5000);
    await expect(link).toBeInViewport({ ratio: 0.9 });
    expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
    await page.keyboard.press('Tab');
  }
  await links.first().focus();
  const opened = page.waitForEvent('popup');
  await page.keyboard.press('Enter');
  await expect(await opened).toHaveURL(destination);
});

test('carousel pauses on card hover and advances immediately after the pointer leaves', async ({ page }) => {
  const start = new Date('2026-10-08T12:00:00Z');
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  await page.goto('/#feedback');
  await page.clock.runFor(3000);
  const card = page.getByRole('region', { name: 'Testimonials carousel' })
    .getByRole('link', { name: /Read recommendation by Brandon Morrill/ });
  await card.hover();
  await page.clock.runFor(10000);
  await expect(card).toBeInViewport({ ratio: 0.9 });
  await page.getByRole('heading', { name: 'What People Say', exact: true }).hover();
  // Complete the slide transition without waiting for the four-second autoplay delay.
  await page.clock.runFor(350);
  await expect(page.getByRole('link', { name: /Read recommendation by Max Gonzalez/ })).toBeInViewport({ ratio: 0.9 });
  await expect(card).not.toBeInViewport();
});

for (const leavesFirst of ['hover', 'focus']) {
  test(`carousel stays paused when ${leavesFirst} leaves but the other interaction remains`, async ({ page }) => {
    const start = new Date('2026-10-08T12:00:00Z');
    await page.clock.install({ time: start });
    await page.clock.pauseAt(new Date(start.getTime() + 1000));
    await page.goto('/#feedback');
    await page.clock.runFor(3000);
    const card = page.getByRole('region', { name: 'Testimonials carousel' })
      .getByRole('link', { name: /Read recommendation by Brandon Morrill/ });
    await card.hover();
    await card.focus();
    const leave = async (interaction) => {
      if (interaction === 'hover') {
        await page.getByRole('heading', { name: 'What People Say', exact: true }).hover();
      } else {
        await page.getByRole('link', { name: 'Brian Raines - Home', exact: true }).focus();
      }
    };
    await leave(leavesFirst);
    await page.clock.runFor(6000);
    await expect(card).toBeInViewport({ ratio: 0.9 });
    await leave(leavesFirst === 'hover' ? 'focus' : 'hover');
    await page.clock.runFor(350);
    await expect(page.getByRole('link', { name: /Read recommendation by Max Gonzalez/ })).toBeInViewport({ ratio: 0.9 });
    await expect(card).not.toBeInViewport();
  });
}

test('carousel advances on keyboard blur and wraps after the last recommendation', async ({ page }) => {
  const start = new Date('2026-10-08T12:00:00Z');
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  await page.goto('/#feedback');
  await page.clock.runFor(3000);
  const cards = page.getByRole('region', { name: 'Testimonials carousel' })
    .getByRole('link', { name: /Read recommendation by .+ on LinkedIn/ });
  await cards.last().focus();
  await page.clock.runFor(5000);
  await expect(cards.last()).toBeInViewport({ ratio: 0.9 });
  await page.getByRole('link', { name: 'Brian Raines - Home', exact: true }).focus();
  await page.clock.runFor(350);
  await expect(cards.first()).toBeInViewport({ ratio: 0.9 });
  // Normal autoplay continues after the immediate advance.
  await page.clock.runFor(4500);
  await expect(cards.first()).not.toBeInViewport();
});

test('carousel stays paused when the pointer moves between visible cards', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const start = new Date('2026-10-08T12:00:00Z');
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  await page.goto('/#feedback');
  await page.clock.runFor(3000);
  const cards = page.getByRole('region', { name: 'Testimonials carousel' })
    .getByRole('link', { name: /Read recommendation by .+ on LinkedIn/ });
  await cards.nth(0).hover();
  await cards.nth(1).hover();
  await page.clock.runFor(6000);
  await expect(cards.nth(0)).toBeInViewport({ ratio: 0.9 });
  await expect(cards.nth(1)).toBeInViewport({ ratio: 0.9 });
  await page.getByRole('heading', { name: 'What People Say', exact: true }).hover();
  await page.clock.runFor(350);
  await expect(cards.nth(0)).not.toBeInViewport();
});

for (const { link, filename, signature } of [
  { link: 'Brian Raines resume PDF', filename: 'Brian_Raines_Resume.pdf', signature: '%PDF-' },
  { link: 'Download Brian Raines vCard', filename: 'Brian_Raines.vcf', signature: 'BEGIN:VCARD' },
]) {
  test(`${filename} downloads as a usable file`, async ({ page }) => {
    await page.goto('/');
    const downloaded = page.waitForEvent('download');
    await page.getByRole('link', { name: link, exact: true }).click();
    const download = await downloaded;
    expect(download.suggestedFilename()).toBe(filename);
    expect(await download.failure()).toBeNull();
    const content = await readFile(await download.path());
    expect(content.subarray(0, signature.length).toString()).toBe(signature);
    expect(content.length).toBeGreaterThan(100);
  });
}

test('all declared local assets and download links are served', async ({ page, request, baseURL }) => {
  await page.goto('/');
  const references = await page.locator('script[src], link[href], img[src], a[download]').evaluateAll((elements) =>
    elements.map((element) => element.src || element.href));
  const urls = [...new Set(references)].filter((url) => new URL(url).origin === new URL(baseURL).origin);
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    const response = await request.get(url);
    expect(response.ok(), `Missing asset: ${url}`).toBe(true);
    expect((await response.body()).length, `Empty asset: ${url}`).toBeGreaterThan(0);
  }
});

test('social preview image is a served landscape card matching its declared size', async ({ page, request, baseURL }) => {
  await page.goto('/');
  const meta = (selector) => page.locator(selector).getAttribute('content');
  const imageUrl = new URL(await meta('meta[property="og:image"]'));
  expect(await meta('meta[name="twitter:image"]')).toBe(imageUrl.href);
  // The public URL names production; the same path is served locally.
  const response = await request.get(new URL(imageUrl.pathname, baseURL).href);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toMatch(/^image\//);
  expect((await response.body()).length).toBeLessThan(600 * 1024);
  const natural = await page.evaluate(async (path) => {
    const image = new Image();
    image.src = path;
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  }, imageUrl.pathname);
  expect(String(natural.width)).toBe(await meta('meta[property="og:image:width"]'));
  expect(String(natural.height)).toBe(await meta('meta[property="og:image:height"]'));
  expect(natural.width / natural.height).toBeCloseTo(1.91, 1);
});

test('social previews and structured profile data are usable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Brian Raines/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Brian Raines/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  const profiles = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent)));
  const person = profiles.find((profile) => profile['@type'] === 'Person');
  expect(person).toBeDefined();
  expect(person.name).toBe('Brian Raines');
  for (const name of ['LinkedIn', 'GitHub']) {
    const link = page.getByRole('link', { name, exact: true });
    await expect(link).toHaveAttribute('href', /^https:\/\//);
    expect(person.sameAs).toContain(await link.getAttribute('href'));
  }
});
