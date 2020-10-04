import Advert from '../scripts/advert';

test('Should create an Advert object', () => {
	const advert = new Advert('ad1', 5, 60, 'media/advert.png');
	expect(advert.constructor.name).toBe('Advert');
	expect(advert.name).toBe('ad1');
	expect(typeof advert.name).toBe('string');
	expect(advert.start).toBe(5);
	expect(typeof advert.start).toBe('number');
	expect(advert.duration).toBe(60);
	expect(typeof advert.duration).toBe('number');
	expect(advert.image).toBe('media/advert.png');
	expect(typeof advert.image).toBe('string');
});

test('Should throw an error on incomplete parameters on Advert object', () => {
	expect(() => {
		new Advert('', 5, 60, 'media/advert.png');
	}).toThrow();
	expect(() => {
		new Advert(null, 5, 60, '');
	}).toThrow();
	expect(() => {
		new Advert(10, 5, 60, '');
	}).toThrow();
	expect(() => {
		new Advert('ad1', 5, 60, '');
	}).toThrow();
	expect(() => {
		new Advert('ad1', 5, 60, 10);
	}).toThrow();
	expect(() => {
		new Advert('ad1', 5, 60, null);
	}).toThrow();
});
