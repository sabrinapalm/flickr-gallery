// "use strict";
// jshint esversion: 8

let imageGallery = document.querySelector('.image-gallery');
let modalContainer = document.querySelector('#modal-container');
let modalImg = document.querySelector('#modal-image');
let modalTitle = document.querySelector('#modal-title');
let modalDescription = document.querySelector('#modal-description');
let modalClose = document.querySelector('.modal-close');
let themeIcon = document.querySelector('.header-theme-icon');
let loader = document.querySelector('#loader');
let error = document.querySelector('#error');
let animalSearch = document.querySelector('#animals');
let citiesSearch = document.querySelector('#cities');
let mountainsSearch = document.querySelector('#mountains');
let oceanSearch = document.querySelector('#ocean');

let page_num = 1;
let tag = 'blackandwhite';

const getImages = async (page_num, searchValue) => {
	showLoader();

	if (tag !== undefined) {
		tag = searchValue;
	}

	const settings = {
		baseUrl: 'https://www.flickr.com/services/rest/?',
		api_key: '29952213283410c3bb75e68dd56d7af4',
		format: 'json',
		method: 'flickr.photos.search',
		tags: tag,
		media: 'photos',
		privacy_filter: 1,
		nojsoncallback: 1,
		per_page: 24,
		extras: 'description,owner_name',
		safe_search: 1,
	};

	let apiUrl = generateApiUrl(settings, page_num);

	if (!apiUrl) {
		hideLoader();
		return error.classList.add('error-text');
	}

	try {
		let response = await fetch(apiUrl);
		let data = await response.json();
		let images = data.photos.photo;
		handleImages(images);
	} catch (err) {
		error.classList.add('error-text');
		hideLoader();
	}
};

const generateApiUrl = (settings, page_num) => {
	return `${settings.baseUrl}api_key=${settings.api_key}&format=${settings.format}&method=${settings.method}&tags=${settings.tags}&media=${settings.media}&privacy_filter=${settings.privacy_filter}&nojsoncallback=${settings.nojsoncallback}&per_page=${settings.per_page}&extras=${settings.extras}&page=${page_num}`;
};

const handleImages = (images) => {
	if (images.length === 0) {
		hideLoader();
		return error.classList.add('error-text');
	}
	images.forEach((image) => {
		createImageCard({
			id: image.id,
			ownername: image.ownername,
			title: image.title,
			description: image.description._content,
			imageUrl: `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`,
		});
	});
	hideLoader();
};

const createImageCard = (imageData) => {
	const { id, ownername, imageUrl, title, description } = imageData;

	const galleryItem = createElement('div', 'image-gallery-item', null);
	const imgItem = createElement('img', 'img-item', null);
	const hoverItem = createElement('div', 'img-hover', null);
	const hoverText = createElement('div', 'img-text', `@${ownername}`);

	setAttributes(imgItem, {
		src: imageUrl,
		id: id,
		alt: 'flickr-photo',
	});

	hoverItem.append(hoverText);
	galleryItem.append(imgItem, hoverItem);
	imageGallery.append(galleryItem);

	addModalContent(imgItem, title, description);
};

const createElement = (type, className, text) => {
	const element = document.createElement(type);
	element.classList.add(className);
	element.innerText = text;
	return element;
};

const setAttributes = (element, attributes) => {
	for (let prop in attributes) {
		if (attributes.hasOwnProperty(prop)) {
			element[prop] = attributes[prop];
		}
	}
};

const addModalContent = (imgItem, title, description) => {
	imgItem.addEventListener('click', () => {
		modalImg.src = imgItem.src;
		modalTitle.innerText = title;
		modalDescription.innerHTML = description;
		modalContainer.style.display = 'block';
	});
};

const checkCurrentTheme = () => {
	const currentTheme = localStorage.getItem('theme')
		? localStorage.getItem('theme')
		: null;

	if (currentTheme) {
		document.documentElement.setAttribute('theme', currentTheme);

		currentTheme === 'light'
			? (themeIcon.src = './src/assets/light-theme-icon.svg')
			: (themeIcon.src = './src/assets/dark-theme-icon.svg');
	}
};

const changeTheme = () => {
	let theme = document.documentElement.getAttribute('theme');

	if (theme === 'light') {
		document.documentElement.setAttribute('theme', 'dark');
		localStorage.setItem('theme', 'dark');
		themeIcon.src = './src/assets/dark-theme-icon.svg';
	} else {
		document.documentElement.setAttribute('theme', 'light');
		localStorage.setItem('theme', 'light');
		themeIcon.src = './src/assets/light-theme-icon.svg';
	}
};

const pollMoreImages = () => {
	let scrollable = document.documentElement.scrollHeight - window.innerHeight;
	let scrolled = window.scrollY;

	if (Math.ceil(scrolled) === scrollable) {
		page_num++;
		getImages(page_num, tag);
	}
};

const searchNewTag = (value) => {
	imageGallery.innerHTML = '';
	page_num = 1;
	tag = value;
	getImages(page_num, tag);
};

const showLoader = () => {
	loader.classList.add('show');
};

const hideLoader = () => {
	loader.classList.remove('show');
};

window.addEventListener('load', () => {
	getImages(page_num, tag);
});

window.addEventListener('load', () => {
	checkCurrentTheme();
});

window.addEventListener('scroll', () => {
	pollMoreImages();
});

themeIcon.addEventListener('click', () => {
	changeTheme();
});

animalSearch.addEventListener('click', () => {
	searchNewTag(animalSearch.value);
});

citiesSearch.addEventListener('click', () => {
	searchNewTag(citiesSearch.value);
});

mountainsSearch.addEventListener('click', () => {
	searchNewTag(mountainsSearch.value);
});

oceanSearch.addEventListener('click', () => {
	searchNewTag(oceanSearch.value);
});

modalContainer.addEventListener('click', () => {
	modalContainer.style.display = 'none';
});
