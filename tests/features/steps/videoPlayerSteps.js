const { When, Then, Given } = require('cucumber');
const puppeteer = require('puppeteer');

var { setDefaultTimeout } = require('cucumber');
setDefaultTimeout(70 * 1000);

Given('the browser is open', async function () {
	this.browser = await puppeteer.launch({
		executablePath:
			'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
		headless: false,
	});
	this.page = await this.browser.newPage();
});

When('open the page', async function () {
	await this.page.goto('http://localhost:4444');
});

When('play the video player', async function () {
	await this.page.click('.play-btn');
});

Then('the video player is playing', async function () {
	const isPlaying = await this.page.$eval('.video-player', function (el) {
		return !el.paused;
	});
	console.log(isPlaying);
	await this.browser.close();
});

When('the video is in {int} seconds', async function (number) {
	const offset = 500;
	await this.page.waitForTimeout(number * 1000 + offset);
});

Then('the advert will show', async function () {
	const el = await this.page.$('.advert.active');
	console.log(el !== null);
});

Then('the advert will hide', async function () {
	const el = await this.page.$('.advert.active');
	console.log(el === null);
	await this.browser.close();
});
