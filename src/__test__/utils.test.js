const { generateApiUrl } = require('./utils');

test('should generate correct api url', () => {
	let page_num = 1;
	const settings = {
		baseUrl: 'https://www.flickr.com/services/rest/?',
		api_key: '29952213283410c3bb75e68dd56d7af4',
		format: 'json',
		method: 'flickr.photos.search',
		tags: 'blackandwhite',
		media: 'photos',
		privacy_filter: 1,
		nojsoncallback: 1,
		per_page: 12,
		extras: 'description,owner_name',
		safe_search: 1,
	};

	expect(generateApiUrl(settings, page_num)).toEqual(
		'https://www.flickr.com/services/rest/?api_key=29952213283410c3bb75e68dd56d7af4&format=json&method=flickr.photos.search&tags=blackandwhite&media=photos&privacy_filter=1&nojsoncallback=1&per_page=12&extras=description,owner_name&page=1&safe_search=1',
	);
});
