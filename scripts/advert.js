export default class Advert {
	constructor(name, start = 0, duration = 10, image) {
		if (!name || typeof name !== 'string' || name === '')
			throw new Error('Invalid name');
		if (!image || typeof image !== 'string' || image === '')
			throw new Error('Invalid image');
		this.name = name;
		this.start = start;
		this.duration = duration;
		this.image = image;
	}
}
