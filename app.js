import VideoPlayer from './scripts/videoplayer';
import Advert from './scripts/advert';

const videoPlayer = new VideoPlayer(
	document.querySelector('.video-player-wrapper')
);

const advert = new Advert('ad1', 4, 60, 'media/advert.png');

videoPlayer.adverts.add(advert);
