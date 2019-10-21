const imageGallery = document.querySelector('.image-gallery');
const modalContainer = document.querySelector('#modal-container');
const modalImg = document.querySelector('#modal-image');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('#modal-description');
const modalClose = document.querySelector('.modal-close');
const themeIcon = document.querySelector('.header-theme-icon');
const arrowIcon = document.querySelector('.top-arrow-icon');
const loader = document.querySelector('#loader');
const error = document.querySelector('#error');
const animalSearch = document.querySelector('#animals');
const urbanSearch = document.querySelector('#urban');
const mountainsSearch = document.querySelector('#mountains');
const oceanSearch = document.querySelector('#ocean');
const topArrow = document.querySelector('#top-arrow');

const darkIcon = './src/assets/light-theme-icon.svg';
const lightIcon = './src/assets/dark-theme-icon.svg';
const darkArrowIcon = './src/assets/up-arrow-dark.svg';
const lightArrowIcon = './src/assets/up-arrow-light.svg';

let page_num = 1;
let tag = 'blackandwhite';

const getImages = async (page_num, searchValue) => {
    showLoader();

    if (!tag) {
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
        extras: 'description,owner_name,views',
        safe_search: 1,
    };

    let apiUrl = createApiUrl(settings, page_num);

    if (!apiUrl) {
        hideLoader();
        return error.classList.add('error-text');
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let images = data.photos.photo;
        handleImages(images);
    } catch (err) {
        error.classList.add('error-text');
        hideLoader();
    }
};

const createApiUrl = (settings, page_num) => {
    return `${settings.baseUrl}api_key=${settings.api_key}&format=${settings.format}&method=${settings.method}&tags=${settings.tags}&media=${settings.media}&privacy_filter=${settings.privacy_filter}&nojsoncallback=${settings.nojsoncallback}&per_page=${settings.per_page}&extras=${settings.extras}&page=${page_num}`;
};

const handleImages = images => {
    if (images.length === 0) {
        hideLoader();
        return error.classList.add('error-text');
    }
    images.forEach(image => {
        createGalleryImage({
            id: image.id,
            ownername: image.ownername,
            title: image.title,
            description: image.description._content,
            views: image.views,
            imageUrl: `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`,
        });
    });
    hideLoader();
};

const createGalleryImage = imageData => {
    const {
        id,
        ownername,
        imageUrl,
        title,
        description,
        views
    } = imageData;

    const galleryItem = createElement('div', 'image-gallery-item', null);
    const imgItem = createElement('img', 'img-item', null);
    const hoverItem = createElement('div', 'img-hover', null);
    const hoverTitle = createElement('div', 'img-text', `@${ownername}`);
    const hoverViews = createElement('p', 'img-views', `${views} views`);

    setAttributes(imgItem, {
        src: imageUrl,
        id: id,
        alt: 'flickr-photo',
    });

    hoverTitle.append(hoverViews);
    hoverItem.append(hoverTitle);
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


const searchNewTag = value => {
    imageGallery.innerHTML = '';
    page_num = 1;
    tag = value;
    getImages(page_num, tag);
};

const pollMoreImages = () => {
    let scrollable = document.documentElement.scrollHeight - window.innerHeight;
    let scrolled = window.scrollY;

    if (Math.ceil(scrolled) === scrollable) {
        page_num++;
        getImages(page_num, tag);
    }
};

const goToTop = () => {
    let scrolled = window.scrollY;
    if (scrolled > 300) {
        topArrow.classList.add('show-arrow');
    } else {
        topArrow.classList.remove('show-arrow');
    }
};

const checkCurrentTheme = () => {
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.documentElement.setAttribute('theme', currentTheme);
        if (currentTheme === 'light') {
            themeIcon.src = darkIcon;
            arrowIcon.src = darkArrowIcon;
        } else {
            themeIcon.src = lightIcon;
            arrowIcon.src = lightArrowIcon;
        }
    }
};

const changeTheme = () => {
    let theme = document.documentElement.getAttribute('theme');

    if (theme === 'light') {
        document.documentElement.setAttribute('theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.src = lightIcon;
        arrowIcon.src = lightArrowIcon;
    } else {
        document.documentElement.setAttribute('theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.src = darkIcon;
        arrowIcon.src = darkArrowIcon;
    }
};


topArrow.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const showLoader = () => {
    loader.classList.add('show');
};

const hideLoader = () => {
    loader.classList.remove('show');
};

window.addEventListener('scroll', () => {
    pollMoreImages();
    goToTop();
});

window.addEventListener('load', () => {
    checkCurrentTheme();
    getImages(page_num, tag);
});

themeIcon.addEventListener('click', () => {
    changeTheme();
});

animalSearch.addEventListener('click', () => {
    searchNewTag(animalSearch.value);
});

urbanSearch.addEventListener('click', () => {
    searchNewTag(urbanSearch.value);
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