exports.createApiUrl = (settings, page_num) => {
    if (settings === undefined || settings === null) {
        throw new Error('Not an object!');
    }
    if (isNaN(page_num)) {
        throw new Error('Not a number');
    }
    return `${settings.baseUrl}api_key=${settings.api_key}&format=${settings.format}&method=${settings.method}&tags=${settings.tags}&media=${settings.media}&privacy_filter=${settings.privacy_filter}&nojsoncallback=${settings.nojsoncallback}&per_page=${settings.per_page}&extras=${settings.extras}&page=${page_num}&safe_search=${settings.safe_search}`;
};

exports.searchNewTag = value => {
    if (typeof value !== 'string') {
        throw new Error('Not a string!');
    }
    return value;
};