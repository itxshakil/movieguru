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
    }
    else {
        for (let i = 0, length = data.Search.length; i < length; i++) {
            const card = createCardElement(data.Search[i]);
            cardwrapper.appendChild(card);
        }
        main.appendChild(cardwrapper);
        createLoadMoreBtn(data, pageNumber);
        trackEvent('search', 'engagement', `Searched ${searchInput.value.trim()} Queried`);
    }
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
    card.appendChild(img);
    const h2 = createElement("h2");
    const title = document.createTextNode(item.Title);
    h2.appendChild(title);
    card.appendChild(h2);
    let h3 = createElement("h3");
    const year = document.createTextNode(`Year : ${item.Year}`);
    h3.appendChild(year);
    card.appendChild(h3);
    h3 = createElement("h3");
    const type = document.createTextNode(`Type : ${item.Type}`);
    h3.appendChild(type);
    card.appendChild(h3);
    const btn = createElement("button", "model-btn");
    btn.setAttribute('data-id', item.imdbID);
    btn.setAttribute('id', 'modal-btn');
    const info = document.createTextNode('More Info');
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
    if (target.classList.contains('load-btn')) {
        const pageNumber = target.dataset.page;
        fetchResult(parseInt(pageNumber));
    }
}
function showModal() {
    const modal = document.querySelector('#my-modal');
    const closeBtn = modal.querySelector('.close');
    modal.style.display = 'block';
    modal.scrollIntoView();
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    modal.addEventListener('click', (event) => {
        const target = event.target;
        const parentNode = target.parentElement;
        if (parentNode.classList.contains('modal-header') || parentNode.classList.contains('modal-body') || target.classList.contains('modal-header') || target.classList.contains('modal-body')) {
        }
        else {
            modal.remove();
        }
    });
    deferredPrompt.prompt();
}
function createModal(data) {
    const myModal = createElement('div', 'modal');
    myModal.setAttribute('id', 'my-modal');
    const modalHeader = createElement('div', 'modal-header');
    const spanClose = createElement('span', 'close');
    const closebtn = document.createTextNode('x');
    spanClose.appendChild(closebtn);
    modalHeader.appendChild(spanClose);
    const modalBody = createElement('div', 'modal-body');
    for (const [key, value] of Object.entries(data)) {
        if (key == 'Response' || key == 'Type') {
            continue;
        }
        if (key == 'Ratings') {
            const ratings = createElement('h3');
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
                    const textValue = document.createTextNode(`${ratingSource} : ${ratingValue}`);
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
        if (isTruthyValue(value)) {
            const h3 = document.createElement('h3');
            const textValue = document.createTextNode(`${key} : ${value}`);
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
