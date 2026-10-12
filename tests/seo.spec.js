const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page, baseURL }) => {
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(baseURL).origin) return route.continue();
    return route.fulfill({ status: 200, body: '' });
  });
});

for (const failure of ['JavaScript disabled', 'main.js unavailable', 'Bootstrap unavailable']) {
  test.describe(failure, () => {
    test.use({ javaScriptEnabled: failure !== 'JavaScript disabled' });

    test('content, downloads and navigation remain usable after a script failure', async ({ page, isMobile }) => {
      if (failure !== 'JavaScript disabled') {
        await page.route(failure === 'main.js unavailable' ? '**/js/main.js*' : '**/js/bootstrap.min.js',
          (route) => route.abort());
      }
      await page.goto('/');
      await expect(page.locator('.preloader-wrap')).toBeHidden();
      const hero = page.getByRole('banner');
      await expect(hero).not.toHaveCSS('background-image', 'none');
      const downloadPromise = page.waitForEvent('download');
      await hero.getByRole('link', { name: 'Brian Raines resume PDF' }).click();
      expect((await downloadPromise).suggestedFilename()).toBe('Brian_Raines_Resume.pdf');
      const navigation = page.getByRole('navigation', { name: 'Main navigation' });
      const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
      if (isMobile && failure === 'main.js unavailable') await toggle.click();
      await navigation.getByRole('link', { name: 'About', exact: true }).click();
      await expect(page).toHaveURL(/#about$/);
      await expect(page.getByRole('heading', { name: 'About me', exact: true })).toBeInViewport();
      if (isMobile && failure !== 'main.js unavailable') await expect(toggle).toBeHidden();
    });
  });
}

test('initial images load once without replacing the about photo', async ({ page }) => {
  const images = [];
  page.on('request', (request) => {
    if (/\/img\/(hero|bulldog)\//.test(request.url())) images.push(new URL(request.url()).pathname);
  });
  await page.addInitScript(() => { Math.random = () => 0.4; });
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Testimonials carousel' })).toHaveClass(/swiper-initialized/);
  await page.getByRole('region', { name: 'About me', exact: true }).scrollIntoViewIfNeeded();
  const photo = page.locator('.about-photo img');
  await expect.poll(() => photo.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(images.filter((path) => path.includes('/hero/'))).toHaveLength(1);
  expect(images.filter((path) => path.includes('/bulldog/'))).toEqual(['/img/bulldog/8.png']);
});

test.describe('small screens at standard pixel density', () => {
  test.use({ deviceScaleFactor: 1 });

  test('hero uses smaller images without a redundant preload', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.clock.install();
    await page.addInitScript(() => {
      let calls = 0;
      Math.random = () => ((calls++ % 9) + 0.5) / 9;
    });
    const images = [];
    page.on('request', (request) => {
      if (/\/img\/hero\//.test(request.url())) images.push(request.url());
    });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Testimonials carousel' })).toHaveClass(/swiper-initialized/);
    expect(images).toHaveLength(1);
    for (let tick = 0; tick < 9; tick++) await page.clock.runFor(5000);
    await expect.poll(() => new Set(images).size).toBe(9);
    const widths = await page.evaluate(async (urls) => Promise.all(urls.map(async (url) => {
      const image = new Image();
      image.src = url;
      await image.decode();
      return image.naturalWidth;
    })), [...new Set(images)]);
    for (const width of widths) expect(width).toBeLessThanOrEqual(960);
  });
});

test('reduced motion keeps hero and recommendations still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const carousel = page.getByRole('region', { name: 'Testimonials carousel' });
  await expect(carousel).toHaveClass(/swiper-initialized/);
  const hero = page.getByRole('banner');
  const initial = await hero.evaluate((element) => getComputedStyle(element).backgroundImage);
  await page.clock.runFor(15000);
  await expect(hero).toHaveCSS('background-image', initial);
  expect(await carousel.evaluate((element) => element.swiper.activeIndex)).toBe(0);
  expect(await carousel.evaluate((element) => element.swiper.autoplay.running)).toBe(false);
  await expect(page.locator('.scroll-icon')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => carousel.evaluate((element) => element.swiper.autoplay.running)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => carousel.evaluate((element) => element.swiper.autoplay.running)).toBe(false);
});

test('hero stops rotating when offscreen and resumes when visible', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.7; });
  await page.clock.install();
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Testimonials carousel' })).toHaveClass(/swiper-initialized/);
  const hero = page.getByRole('banner');
  await page.getByRole('region', { name: 'About me', exact: true }).scrollIntoViewIfNeeded();
  await expect(hero).not.toBeInViewport();
  await page.clock.runFor(100);
  const initial = await hero.evaluate((element) => getComputedStyle(element).backgroundImage);
  await page.clock.runFor(15000);
  await expect(hero).toHaveCSS('background-image', initial);
  await hero.scrollIntoViewIfNeeded();
  await expect(hero).toBeInViewport();
  await page.clock.runFor(5100);
  await expect(hero).not.toHaveCSS('background-image', initial);
});

test('sitemap advertises the crawlable canonical home page', async ({ page, request }) => {
  const robotsResponse = await request.get('/robots.txt');
  expect(robotsResponse.ok()).toBe(true);
  const robots = await robotsResponse.text();
  expect(robots).toMatch(/^User-agent: \*$/m);
  expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m);
  expect(robots).toMatch(/^Sitemap: https:\/\/raines\.io\/sitemap\.xml$/m);
  const sitemapResponse = await request.get('/sitemap.xml');
  expect(sitemapResponse.ok()).toBe(true);
  expect(sitemapResponse.headers()['content-type']).toMatch(/(?:application|text)\/xml/);
  await page.goto('/');
  const urls = await page.evaluate((xml) => {
    const document = new DOMParser().parseFromString(xml, 'application/xml');
    if (document.querySelector('parsererror')) throw new Error('Invalid sitemap XML');
    return [...document.querySelectorAll('url > loc')].map((element) => element.textContent);
  }, await sitemapResponse.text());
  expect(urls).toEqual(['https://raines.io/']);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', urls[0]);
  for (const selector of ['meta[property="og:url"]', 'meta[name="twitter:url"]']) {
    await expect(page.locator(selector)).toHaveAttribute('content', urls[0]);
  }
});

test('profile graph identifies one person without describing the mascot as a portrait', async ({ page }) => {
  await page.goto('/');
  const profiles = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent)));
  const person = profiles.find((profile) => profile['@type'] === 'Person');
  const site = profiles.find((profile) => profile['@type'] === 'WebSite');
  const profilePage = profiles.find((profile) => profile['@type'] === 'ProfilePage');
  expect(person).not.toHaveProperty('image');
  expect(person['@id']).toBe('https://raines.io/#person');
  expect(site.author['@id']).toBe(person['@id']);
  expect(profilePage.mainEntity['@id']).toBe(person['@id']);
  await expect(page.locator('.about-photo img')).toHaveAttribute('alt', '');
});

test('content images reserve their natural aspect ratios', async ({ page }) => {
  await page.goto('/');
  const images = await page.locator('main img').evaluateAll(async (images) =>
    Promise.all(images.map(async (element) => {
      const image = new Image();
      image.src = element.src;
      await image.decode();
      const box = element.getBoundingClientRect();
      return { src: element.src, width: Number(element.getAttribute('width')), renderedRatio: box.width / box.height,
        height: Number(element.getAttribute('height')), ratio: image.naturalWidth / image.naturalHeight };
    })));
  for (const image of images) {
    expect(image.width, image.src).toBeGreaterThan(0);
    expect(image.height, image.src).toBeGreaterThan(0);
    expect(image.width / image.height, image.src).toBeCloseTo(image.ratio);
    expect(image.renderedRatio, image.src).toBeCloseTo(image.ratio);
  }
});

test('main heading outline does not skip levels', async ({ page }) => {
  await page.goto('/');
  const headings = await page.getByRole('main').getByRole('heading').evaluateAll((elements) =>
    elements.map((element) => ({ level: Number(element.tagName.substring(1)), text: element.textContent })));
  let previous = 0;
  for (const heading of headings) {
    expect(heading.level, heading.text).toBeLessThanOrEqual(previous + 1);
    previous = heading.level;
  }
});

test('loaded local JavaScript stays within a 350 KiB uncompressed budget', async ({ page, request, baseURL }) => {
  await page.goto('/');
  const scripts = await page.locator('script[src]').evaluateAll((elements) => elements.map((element) => element.src));
  let bytes = 0;
  for (const url of scripts.filter((url) => new URL(url).origin === new URL(baseURL).origin)) {
    const response = await request.get(url);
    expect(response.ok(), url).toBe(true);
    bytes += (await response.body()).length;
  }
  expect(bytes).toBeLessThan(350 * 1024);
});
