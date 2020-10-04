export default class VideoPlayer {
	constructor(element) {
		if (!element) {
			throw new Error('No element defined');
		}
		if (!element.querySelector('video')) {
			throw new Error('No video element found!');
		}
		this.elements = {
			root: element,
			video: element.querySelector('video'),
			overlay: element.querySelector('.video-overlay'),
			controls: {
				play: element.querySelector('.play-btn'),
				mute: element.querySelector('.mute-btn'),
				fullscreen: element.querySelector('.fullscreen-btn'),
			},
			seekbar: {
				wrapper: element.querySelector('.seekbar'),
				active: element.querySelector('.seekbar-active'),
			},
			timestamp: {
				current: element.querySelector('.timestamp-current'),
				total: element.querySelector('.timestamp-total'),
			},
		};
		this.adverts = {
			items: [],
			add: (advert) => {
				this.adverts.items.push(advert);
				this.createAdTick(advert);
			},
		};
		this.events = {
			loaded: new Event('loaded'),
		};
		this.isPlaying = false;
		this.isMuted = false;
		this.isFullscreen = false;
		this.init();
	}

	init() {
		this.initEvents();
		this.bindControls();
		this.elements.video.load();
	}

	parseTimestamp(time) {
		var minutes = Math.floor((time % 3600) / 60);
		var seconds = Math.floor(time - minutes * 60);
		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}

	updateRender() {
		this.elements.seekbar.active.style.width = `${
			(this.elements.video.currentTime / this.elements.video.duration) *
			100
		}%`;
		this.elements.timestamp.current.innerHTML = this.parseTimestamp(
			this.elements.video.currentTime
		);
		this.elements.timestamp.total.innerHTML = this.parseTimestamp(
			this.elements.video.duration
		);
		if (this.isPlaying) {
			this.elements.controls.play.classList.add('playing');
		} else {
			this.elements.controls.play.classList.remove('playing');
		}
		if (this.isMuted) {
			this.elements.controls.mute.classList.remove('unmuted');
		} else {
			this.elements.controls.mute.classList.add('unmuted');
		}
		if (this.isFullscreen) {
			this.elements.controls.fullscreen.classList.add('active');
		} else {
			this.elements.controls.fullscreen.classList.remove('active');
		}
		this.adverts.items.forEach((advert) => {
			const advertElement = this.elements.overlay.querySelector(
				`#${advert.name}`
			);
			if (advertElement !== null) {
				if (
					this.elements.video.currentTime >= advert.start &&
					this.elements.video.currentTime <=
						advert.start + advert.duration
				) {
					advertElement.classList.add('active');
				} else {
					advertElement.classList.remove('active');
				}
			}
		});
	}

	initAds() {
		this.clearAds();
		this.adverts.items.forEach((advert) => {
			this.createAdvert(advert);
		});
	}

	clearAds() {
		[
			this.elements.seekbar.wrapper.querySelectorAll('.ad-dot'),
			this.elements.overlay.querySelectorAll('.advert'),
		].forEach((elems) => {
			if (elems)
				elems.forEach((elem) => {
					elem.remove();
				});
		});
	}

	createAdvert(advert) {
		this.createAdTick(advert);
		this.createAdImage(advert);
	}

	createAdTick(advert) {
		const tickElement = document.createElement('div');
		tickElement.classList.add('ad-dot');
		tickElement.style.left = `${
			(advert.start / this.elements.video.duration) * 100
		}%`;
		this.elements.seekbar.wrapper.prepend(tickElement);
	}

	createAdImage(advert) {
		const advertWrapperElement = document.createElement('div');
		advertWrapperElement.classList.add('advert');
		advertWrapperElement.id = advert.name;
		const advertImageElement = document.createElement('img');
		advertImageElement.classList.add('advert-image');
		advertImageElement.src = advert.image;
		advertWrapperElement.appendChild(advertImageElement);
		this.elements.overlay.appendChild(advertWrapperElement);
	}

	handleFullscreen() {
		if (!this.isFullscreen) {
			this.fullscreen();
		} else {
			this.exitFullscreen();
		}
		this.isFullscreen = !this.isFullscreen;
	}

	handlePlay() {
		if (!this.isPlaying) {
			this.play();
		} else {
			this.pause();
		}
		this.isPlaying = !this.isPlaying;
	}

	handleMute() {
		if (!this.isMuted) {
			this.mute();
		} else {
			this.unmute();
		}
		this.isMuted = !this.isMuted;
	}

	bindControls() {
		this.elements.controls.play.addEventListener('click', () => {
			this.handlePlay();
			this.updateRender();
		});
		this.elements.controls.mute.addEventListener('click', () => {
			this.handleMute();
			this.updateRender();
		});
		this.elements.controls.fullscreen.addEventListener('click', () => {
			this.handleFullscreen();
			this.updateRender();
		});
	}

	initEvents() {
		this.elements.video.addEventListener('ended', () => {
			this.isPlaying = false;
			this.updateRender();
		});
		['play', 'playing'].forEach((event) => {
			this.elements.video.addEventListener(event, () => {
				this.isPlaying = true;
				this.updateRender();
			});
		});
		[('loadeddata', 'loadedmetadata')].forEach((event) => {
			this.elements.video.addEventListener(
				event,
				() => {
					this.updateRender();
					this.initAds();
				},
				false
			);
		});
		this.elements.video.addEventListener('timeupdate', () => {
			this.updateRender();
		});
	}

	play() {
		if (!this.isPlaying) {
			this.elements.video.play();
		}
	}

	pause() {
		if (this.isPlaying) this.elements.video.pause();
	}

	mute() {
		this.elements.video.volume = 0;
	}

	unmute() {
		this.elements.video.volume = 1.0;
	}

	fullscreen() {
		if (document.fullscreenElement === null) {
			if (this.elements.root.requestFullscreen) {
				this.elements.root.requestFullscreen();
			} else if (this.elements.root.mozRequestFullscreen) {
				this.elements.root.mozRequestFullscreen();
			} else if (this.elements.root.webkitRequestFullscreen) {
				this.elements.root.webkitRequestFullscreen();
			} else if (this.elements.root.msRequestFullscreen) {
				this.elements.root.msRequestFullscreen();
			}
		} else {
			throw new Error('Another element has been fullscreen');
		}
	}

	exitFullscreen() {
		if (document.fullscreenElement !== null) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullscreen) {
				document.mozCancelFullscreen();
			} else if (document.webkitCancelFullscreen) {
				document.webkitCancelFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		} else {
			throw new Error('No active fullscreen element');
		}
	}
}
