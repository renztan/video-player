import 'babel-polyfill';

jest.useFakeTimers();

describe('Test title and header of the app', () => {
	beforeEach(async () => {
		await page.goto(PATH, { waitUntil: 'load' });
	});
	test('Should contain video player', async () => {
		const videoPlayer = await page.$('.video-player-wrapper');
		expect(videoPlayer).not.toBeNull();
	});
	test('Should mute video', async () => {
		await page.click('.mute-btn');
		const isMuted = await page.$eval(
			'.mute-btn',
			(el) => !el.classList.toString().split(' ').includes('unmuted')
		);
		expect(isMuted).toBeTruthy();
	});

	test('Should display ad at 4 seconds', async () => {
		await page.click('.play-btn');
		await page.waitForTimeout(4500);
		const advert = await page.$('.advert.active');
		expect(advert).not.toBeNull();
	}, 5000);

	test('Should display ad for 60 seconds', async () => {
		await page.click('.play-btn');
		await page.waitForTimeout(64500);
		const advert = await page.$('.advert.active');
		expect(advert).toBeNull();
	}, 65000);
});
