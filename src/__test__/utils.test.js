const {
    createApiUrl,
    searchNewTag
} = require('./utils');

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

describe('createApiUrl', () => {
    it('should generate correct api url', () => {
        expect(createApiUrl(settings, page_num)).toEqual(
            'https://www.flickr.com/services/rest/?api_key=29952213283410c3bb75e68dd56d7af4&format=json&method=flickr.photos.search&tags=blackandwhite&media=photos&privacy_filter=1&nojsoncallback=1&per_page=12&extras=description,owner_name&page=1&safe_search=1',
        );
    });

    it('should throw an error if settings is undefined', () => {
        expect(() => createApiUrl(undefined, page_num)).toThrow();
    });

    it('should throw an error if page_num is not a number', () => {
        expect(() => createApiUrl(settings, 'flickr')).toThrow();
    });
});

describe('searchNewTag', () => {
    it('search value should be string', () => {
        const search = 'ocean';
        expect(searchNewTag(search)).toBe('ocean');
    });

    it('search value number to throw error', () => {
        const search = 12;
        expect(() => searchNewTag(search)).toThrow();
    });

    it('search value undefined to throw error', () => {
        expect(() => searchNewTag(undefined)).toThrow();
    });
});