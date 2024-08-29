"use strict";
const APIKEY = 'eaa8df42';
const main = document.getElementById('main');
const searchForm = document.getElementById('searchForm');
const searchInput = searchForm.querySelector("#search");
const yearInput = searchForm.querySelector("input[type='number']");
const type = searchForm.querySelector("select");
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});
let cardwrapper;
main.addEventListener('click', mainClicked);
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearPreviousResult();
    if (searchInput.value.trim().length === 0) {
        showMessage("Please enter movie name");
        return false;
    }
    cardwrapper = createElement("div", "card-wrapper");
    fetchResult();
});
function clearPreviousResult() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}
function fetchResult(pageNumber = 1) {
    const name = searchInput.value.trim();
    const year = yearInput.value;
    const searchType = type.value;
    const url = `https://www.omdbapi.com/?apikey=${APIKEY}&s=${name}&y=${year}&type=${searchType}&page=${pageNumber}`;
    if (pageNumber != 1)
        removeLoadMoreBtn();
    showLoadingText();
    fetch(url)
        .then(response => {
        response.json()
            .then((data) => {
            handleResult(data, pageNumber);
        })
            .catch((err) => {
            showMessage(err);
        });
    }).catch(() => {
        showMessage("Some error occured");
    });
}
function removeLoadMoreBtn() {
    const loadBtn = document.querySelector('.load-btn');
    loadBtn.remove();
}
function showLoadingText() {
    const loading = createElement('div', 'loading');
    const loadingText = document.createTextNode('Loading Please Wait...');
    loading.appendChild(loadingText);
    main.appendChild(loading);
}
function handleResult(data, pageNumber) {
    removeLoading();
    if (data.Response === 'False') {
        showMessage(data.Error);
        addAdvertisement();
    }
    else {
        for (let i = 0, length = data.Search.length; i < length; i++) {
            const card = createCardElement(data.Search[i]);
            cardwrapper.appendChild(card);
        }
        main.appendChild(cardwrapper);
        addAdvertisement();
        createLoadMoreBtn(data, pageNumber);
        trackEvent('search', 'engagement', `Searched ${searchInput.value.trim()} Queried`);
    }
}
function addAdvertisement() {
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.setAttribute('data-ad-format', 'fluid');
    ad.setAttribute('data-ad-layout-key', '-6t+ed+2i-1n-4w');
    ad.setAttribute('data-ad-client', 'ca-pub-4132498105758259');
    ad.setAttribute('data-ad-slot', '2203921427');
    main.appendChild(ad);
    (adsbygoogle = window.adsbygoogle || []).push({});
}
function createLoadMoreBtn(data, pageNumber) {
    if (Math.ceil(data.totalResults / 10) > pageNumber) {
        const loadBtn = createElement("button", "load-btn");
        const nextPage = ++pageNumber;
        loadBtn.setAttribute('data-page', nextPage.toString());
        const info = document.createTextNode('Load More');
        loadBtn.appendChild(info);
        main.appendChild(loadBtn);
    }
}
function removeLoading() {
    const loading = document.querySelector('div.loading');
    loading.remove();
}
function createElement(tagName, ...classes) {
    const element = document.createElement(tagName);
    element.classList.add(...classes);
    return element;
}
function isTruthyValue(value) {
    return value && value != 'N/A';
}
function createCardElement(item) {
    const card = createElement("div", "card");
    const img = createElement("img", "poster");
    img.setAttribute("height", "320px");
    img.setAttribute("width", "100%");
    img.setAttribute("alt", item.Title);
    img.setAttribute("loading", "lazy");
    img.src = item.Poster == "N/A" ? "no-poster.jpg" : item.Poster;
    img.setAttribute('data-id', item.imdbID);
    card.appendChild(img);
    const h3 = document.createElement("h3");
    h3.classList.add("custom-h3");
    const capitalizedType = item.Type.charAt(0).toUpperCase() + item.Type.slice(1).toLowerCase();
    const typeYearText = document.createTextNode(`${capitalizedType} - ${item.Year}`);
    h3.appendChild(typeYearText);
    card.appendChild(h3);
    const h2 = createElement("h2");
    h2.classList.add("custom-h2");
    const title = document.createTextNode(item.Title);
    h2.appendChild(title);
    card.appendChild(h2);
    const btn = createElement("button", "model-btn");
    btn.setAttribute('data-id', item.imdbID);
    btn.setAttribute('id', 'modal-btn');
    const info = document.createTextNode('View details →');
    btn.appendChild(info);
    card.appendChild(btn);
    return card;
}
function showMessage(errorText) {
    const h3 = createElement('h3');
    const error = document.createTextNode(errorText);
    h3.appendChild(error);
    main.appendChild(h3);
}
function mainClicked(event) {
    const target = event.target;
    if (target.classList.contains('model-btn')) {
        const imdbID = target.dataset.id;
        fetchInfo(imdbID);
        trackEvent('view_details', 'engagement', `Movie Details ${imdbID}`);
    }
    if (target.classList.contains('poster')) {
        const imdbID = target.dataset.id;
        fetchInfo(imdbID);
        trackEvent('view_details', 'engagement', `Movie Details ${imdbID}`);
    }
    if (target.classList.contains('load-btn')) {
        const pageNumber = target.dataset.page;
        fetchResult(parseInt(pageNumber));
    }
}
function showModal() {
    const modal = document.querySelector('#my-modal');
    const closeBtn = modal.querySelector('.close');
    modal.showModal();
    closeBtn.addEventListener('click', () => {
        modal.close();
    });
    modal.addEventListener('close', () => {
        setTimeout(() => {
            modal.remove();
        }, 700);
    });
    if (deferredPrompt) {
        deferredPrompt.prompt();
    }
}
function createModal(data) {
    const myModal = createElement('dialog', 'modal');
    myModal.setAttribute('id', 'my-modal');
    const modalHeader = createElement('div', 'modal-header');
    const spanClose = createElement('span', 'close');
    const closebtn = document.createTextNode('x');
    spanClose.appendChild(closebtn);
    modalHeader.appendChild(spanClose);
    const modalBody = createElement('div', 'modal-body');
    for (const [key, value] of Object.entries(data)) {
        if (key == 'Response' || key == 'Type' || key == 'imdbID') {
            continue;
        }
        if (key == 'Ratings') {
            const ratings = createElement('h3');
            ratings.style.fontWeight = '600';
            const textratings = document.createTextNode('Ratings :');
            ratings.appendChild(textratings);
            modalBody.appendChild(ratings);
            for (let i = 0; i < value.length; i++) {
                const Ratings = data.Ratings;
                const Rating = Ratings[i];
                const ratingSource = Rating.Source;
                const ratingValue = Rating.Value;
                if (isTruthyValue(ratingValue)) {
                    const h3 = createElement('h3', `ratings-${i}`);
                    const label = document.createElement('span');
                    label.style.fontWeight = '600';
                    label.textContent = `${ratingSource}: `;
                    const textValue = document.createTextNode(ratingValue);
                    h3.appendChild(label);
                    h3.appendChild(textValue);
                    modalBody.appendChild(h3);
                }
            }
            continue;
        }
        if (key == 'Title') {
            const h2 = createElement('h2');
            const headerTitle = document.createTextNode(value);
            h2.appendChild(headerTitle);
            modalHeader.appendChild(h2);
            continue;
        }
        if (key === 'Runtime' && isTruthyValue(value)) {
            const runtimeStr = value;
            const runtimeMinutes = parseInt(runtimeStr);
            const hours = Math.floor(runtimeMinutes / 60);
            const minutes = runtimeMinutes % 60;
            const formattedRuntime = `${hours}h ${minutes}m`;
            const h3 = document.createElement('h3');
            const label = document.createElement('span');
            label.style.fontWeight = '600';
            label.textContent = `${key}: `;
            const textValue = document.createTextNode(formattedRuntime);
            h3.appendChild(label);
            h3.appendChild(textValue);
            modalBody.appendChild(h3);
            continue;
        }
        if (key == 'Plot' && isTruthyValue(value)) {
            const plotFullText = value;
            const plotExcerpt = plotFullText.length > 100 ? plotFullText.substring(0, 100) + '...' : plotFullText;
            const h3 = document.createElement('h3');
            const label = document.createElement('span');
            label.style.fontWeight = '600';
            label.textContent = `${key}: `;
            h3.appendChild(label);
            const plotText = document.createElement('span');
            plotText.textContent = plotExcerpt;
            plotText.classList.add('plot-text');
            h3.appendChild(plotText);
            const showMore = document.createElement('small');
            showMore.textContent = plotFullText.length > 100 ? ' Show More' : '';
            showMore.style.color = 'blue';
            showMore.style.cursor = 'pointer';
            showMore.classList.add('show-more');
            h3.appendChild(showMore);
            showMore.addEventListener('click', () => {
                if (showMore.textContent === ' Show More') {
                    plotText.textContent = plotFullText;
                    showMore.textContent = ' Show Less';
                }
                else {
                    plotText.textContent = plotExcerpt;
                    showMore.textContent = ' Show More';
                }
            });
            modalBody.appendChild(h3);
            continue;
        }
        if (key == 'Poster') {
            const img = createElement("img");
            img.setAttribute('height', '320px');
            img.setAttribute('width', 'auto');
            img.setAttribute('alt', 'Poster');
            img.setAttribute('class', 'poster');
            img.src = value == "N/A" ? "no-poster.jpg" : value;
            modalBody.prepend(img);
            continue;
        }
        if (key == 'imdbVotes' && isTruthyValue(value)) {
            const h3 = document.createElement('h3');
            const label = document.createElement('span');
            label.style.fontWeight = '600';
            label.textContent = `${key} : `;
            const imdbLink = document.createElement('a');
            imdbLink.href = `https://www.imdb.com/title/${data.imdbID}/`;
            imdbLink.target = '_blank';
            imdbLink.textContent = value;
            imdbLink.style.textDecoration = 'none';
            imdbLink.style.color = 'inherit';
            h3.appendChild(label);
            h3.appendChild(imdbLink);
            modalBody.appendChild(h3);
            continue;
        }
        if (isTruthyValue(value)) {
            const h3 = document.createElement('h3');
            const label = document.createElement('span');
            label.style.fontWeight = '600';
            label.textContent = `${key} : `;
            const textValue = document.createTextNode(value);
            h3.appendChild(label);
            h3.appendChild(textValue);
            modalBody.appendChild(h3);
        }
    }
    myModal.appendChild(modalHeader);
    myModal.appendChild(modalBody);
    main.appendChild(myModal);
}
function fetchInfo(imdbID) {
    const url = `https://www.omdbapi.com/?apikey=${APIKEY}&i=${imdbID}&plot=full`;
    fetch(url)
        .then(response => {
        response.json().then(data => {
            createModal(data);
            showModal();
        });
    });
}
function trackEvent(action, category, label, value = null) {
    try {
        if (typeof gtag === 'function') {
            const eventData = {
                'event_category': category,
                'event_label': label,
            };
            if (typeof value === 'number') {
                eventData['value'] = value;
            }
            gtag('event', action, eventData);
        }
        else {
            console.warn('Google Analytics is not loaded');
        }
    }
    catch (error) {
        console.error('Error sending event to Google Analytics', error);
    }
}
