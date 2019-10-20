exports.generateApiUrl = (settings, page_num) => {
	return `${settings.baseUrl}api_key=${settings.api_key}&format=${settings.format}&method=${settings.method}&tags=${settings.tags}&media=${settings.media}&privacy_filter=${settings.privacy_filter}&nojsoncallback=${settings.nojsoncallback}&per_page=${settings.per_page}&extras=${settings.extras}&page=${page_num}&safe_search=${settings.safe_search}`;
};
