const APIKEY = 'eaa8df42';
const main = document.getElementById('main') as HTMLElement;
const searchForm = document.getElementById('searchForm') as HTMLFormElement;
const searchInput = searchForm.querySelector("#search") as HTMLInputElement;
const yearInput = searchForm.querySelector("input[type='number']") as HTMLInputElement;
const type = searchForm.querySelector("select") as HTMLSelectElement;

let cardwrapper: HTMLDivElement;

main.addEventListener('click', mainClicked);

searchForm.addEventListener('submit', function (event: Event) {
    event.preventDefault();

    clearPreviousResult();

    if (searchInput.value.trim().length === 0) {
        showMessage("Please enter movie name");
        return false;
    }

    cardwrapper = createElement("div", "card-wrapper") as HTMLDivElement;
    fetchResult();
});

function clearPreviousResult() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

function fetchResult(pageNumber = 1) {
    let name = searchInput.value.trim();
    let year = yearInput.value;
    let searchType = type.value;
    let url = `https://www.omdbapi.com/?apikey=${APIKEY}&s=${name}&y=${year}&type=${searchType}&page=${pageNumber}`;

    if (pageNumber != 1) removeLoadMoreBtn();

    showLoadingText();

    fetch(url)
        .then(response => {
            response.json()
                .then((data) => {
                    handleResult(data, pageNumber);
                })
                .catch((err) => {
                    showMessage(err);
                })
        }).catch(() => {
            showMessage("Some error occured");
        });
}

function removeLoadMoreBtn() {
    let loadBtn = document.querySelector('.load-btn') as HTMLButtonElement;
    loadBtn.remove();
}

function showLoadingText() {
    let loading = createElement('div', 'loading');
    let loadingText = document.createTextNode('Loading Please Wait...');
    loading.appendChild(loadingText);
    main.appendChild(loading);
}

function handleResult(data: { Response: string; Error: string; Search: string | any[]; totalResults: number; }, pageNumber: number) {
    removeLoading();

    if (data.Response === 'False') {
        showMessage(data.Error);
    } else {
        for (let i = 0, length = data.Search.length; i < length; i++) {
            let card = createCardElement(data.Search[i]);
            cardwrapper.appendChild(card);
        }
        main.appendChild(cardwrapper);

        createLoadMoreBtn(data, pageNumber);
    }
}

function createLoadMoreBtn(data: { Response?: string; Error?: string; Search?: string | any[]; totalResults: any; }, pageNumber: number) {
    if (Math.ceil(data.totalResults / 10) > pageNumber) {
        const loadBtn = createElement("button", "load-btn")
        let nextPage = ++pageNumber;
        loadBtn.setAttribute('data-page', nextPage.toString());
        let info = document.createTextNode('Load More');
        loadBtn.appendChild(info)
        main.appendChild(loadBtn);
    }
}

function removeLoading() {
    let loading = document.querySelector('div.loading') as HTMLDivElement;
    loading.remove();
}

function createElement(tagName: string, ...classes: (string)[]) {
    let element = document.createElement(tagName);
    element.classList.add(...classes);

    return element;
}

function createCardElement(item: { Title: string; Poster: string; Year: string; Type: string; imdbID: string; }) {
    let card = createElement("div", "card");

    let img = createElement("img", "poster") as HTMLImageElement;
    img.setAttribute("height", "320px");
    img.setAttribute("width", "100%");
    img.setAttribute("alt", item.Title);
    img.setAttribute("loading", "lazy");
    img.src = item.Poster != "N/A" ? item.Poster : "no-poster.jpg"
    card.appendChild(img);

    let h2 = createElement("h2");
    let title = document.createTextNode(item.Title);
    h2.appendChild(title);
    card.appendChild(h2);

    let h3 = createElement("h3");
    let year = document.createTextNode("Year : " + item.Year);
    h3.appendChild(year);
    card.appendChild(h3);

    h3 = createElement("h3");
    let type = document.createTextNode("Type : " + item.Type);
    h3.appendChild(type);
    card.appendChild(h3);

    let btn = createElement("button", "model-btn")
    btn.setAttribute('data-id', item.imdbID);
    btn.setAttribute('id', 'modal-btn');
    let info = document.createTextNode('More Info');
    btn.appendChild(info);
    card.appendChild(btn);
    return card;
}

function showMessage(errorText: string) {
    let h3 = createElement('h3');
    let error = document.createTextNode(errorText);
    h3.appendChild(error);
    main.appendChild(h3);
}

function mainClicked(event: Event) {
    let target = event.target as HTMLElement;
    if (target.classList.contains('model-btn')) {
        let imdbID = target.dataset.id as string;
        fetchInfo(imdbID);
    }
    if (target.classList.contains('load-btn')) {
        let pageNumber = target.dataset.page as string;
        fetchResult(parseInt(pageNumber));
    }
}

function showModal() {
    let modal = document.querySelector('#my-modal') as HTMLDivElement;
    const closeBtn = modal.querySelector('.close') as HTMLElement;

    modal.style.display = 'block';

    modal.scrollIntoView();
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', function (event: Event) {
        let target = event.target as HTMLElement;
        let parentNode = target.parentElement as Node;

        if (parentNode.classList.contains('modal-header') || parentNode.classList.contains('modal-body') || target.classList.contains('modal-header') || target.classList.contains('modal-body')) {

        } else {
            modal.remove();
        }
    });
}
interface OMDBData extends Object {
    Ratings: { Source: string, Value: string }[]
}
function createModal(data: OMDBData) {
    let myModal = createElement('div', 'modal');
    myModal.setAttribute('id', 'my-modal');

    let modalHeader = createElement('div', 'modal-header');

    let spanClose = createElement('span', 'close');
    let closebtn = document.createTextNode('x');
    spanClose.appendChild(closebtn);

    modalHeader.appendChild(spanClose);

    let modalBody = createElement('div', 'modal-body');
    for (let [key, value] of Object.entries(data)) {
        if (key == 'Response' || key == 'Type') {
            continue;
        }

        if (key == 'Ratings') {
            let ratings = createElement('h3');
            let textratings = document.createTextNode('Ratings :');
            ratings.appendChild(textratings);
            modalBody.appendChild(ratings);

            for (let i = 0; i < value.length; i++) {
                let h3 = createElement('h3', "ratings-" + i);
                let Ratings = data.Ratings as [];
                let Rating = Ratings[i] as { Source: string, Value: string };
                let ratingSource = Rating.Source
                let ratingValue = Rating.Value
                let textValue = document.createTextNode(`${ratingSource} : ${ratingValue}`);
                h3.appendChild(textValue);
                modalBody.appendChild(h3);
            }
            continue;
        }

        if (key == 'Title') {
            let h2 = createElement('h2');
            let headerTitle = document.createTextNode(value);
            h2.appendChild(headerTitle);
            modalHeader.appendChild(h2);
            continue;
        }

        if (key == 'Poster') {
            let img = createElement("img") as HTMLImageElement;
            img.setAttribute('height', '320px');
            img.setAttribute('width', 'auto');
            img.setAttribute('alt', 'Poster');
            img.setAttribute('class', 'poster');
            img.src = value != "N/A" ? value : "no-poster.jpg";
            modalBody.prepend(img);
            continue;
        }

        let h3 = document.createElement('h3');
        let textValue = document.createTextNode(`${key} : ${value}`);
        h3.appendChild(textValue);
        modalBody.appendChild(h3);

        myModal.appendChild(modalHeader);
        myModal.appendChild(modalBody);
        main.appendChild(myModal);
    }
}

function fetchInfo(imdbID: string) {
    let url = `https://www.omdbapi.com/?apikey=${APIKEY}&i=${imdbID}&plot=full`;

    fetch(url).then(response => {
        response.json().then(data => {
            createModal(data);
            showModal();
        })
    })
}
