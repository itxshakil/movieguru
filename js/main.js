const apikey = 'eaa8df42';
const main = document.getElementById('main');
const form = document.getElementById('searchForm');
const searchString = form.querySelector("#search");
const y = form.querySelector("input[type='number']");
const type = form.querySelector("select");

// This is just for initialisation 
let sValue = "";
let yearValue = "";
let typeValue = "";

// loading text htmlElement
let loading = null;
let loadingText = "";

// search Form Listener
form.addEventListener('submit', function (e) {
    e.preventDefault();
    // because if after submitting form if user change value it wont cause to load more Results.
    sValue = searchString.value;
    yearValue = y.value;
    typeValue = type.value;
    // Clear Main Area
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }

    fetchResult();
    main.addEventListener('click', moreInfo);
});

// Main Function for fetching search result

function fetchResult(page = 1) {
    let xhr = new XMLHttpRequest();
    let url = 'https://www.omdbapi.com/?apikey=' + apikey + '&s=' + sValue + '&y=' + yearValue + '&type=' + typeValue + '&page=' + page;
    if (page != 1) {
        // Remove Load More Button
        let loadBtn = document.querySelector('.load-btn');
        loadBtn.parentNode.removeChild(loadBtn);
    }
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 2) {
            // because we want to delete this in different block
            loading = document.createElement('div');
            loadingText = document.createTextNode('Loading Please Wait...');
            loading.appendChild(loadingText);
            main.appendChild(loading);
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Remove Loading Text
            loading.parentNode.removeChild(loading);

            let data = JSON.parse(xhr.response);
            if (data.Response == 'False') {
                let h3 = document.createElement('h3');
                let error = document.createTextNode(data.Error);
                h3.appendChild(error);
                main.appendChild(h3);
            } else {
                for (let i = 0, length = data.Search.length; i < length; i++) {
                    let card = document.createElement("div");
                    card.classList.add("card");
                    let img = document.createElement("img");
                    img.setAttribute('height', '320px');
                    img.setAttribute('width', '100%');
                    img.setAttribute('alt', data.Search[i].Title);
                    img.setAttribute('class', 'poster');
                    img.src = data.Search[i].Poster != "N/A" ? data.Search[i].Poster : "no-poster.jpg";
                    card.appendChild(img);
                    let h2 = document.createElement("h2");
                    h2.classList.add("title");
                    let title = document.createTextNode(data.Search[i].Title);
                    // Font size on basis of title length so long title dont mess card layout
                    if (title.length > 20) {
                        h2.style.fontSize = ".9rem";
                    }
                    h2.appendChild(title);
                    card.appendChild(h2);
                    let h3 = document.createElement("h3");
                    h3.classList.add("year");
                    let year = document.createTextNode('Year : ' + data.Search[i].Year);
                    h3.appendChild(year);
                    card.appendChild(h3);
                    h3 = document.createElement("h3");
                    h3.classList.add("type");
                    let type = document.createTextNode('Type : ' + data.Search[i].Type);
                    h3.appendChild(type);
                    card.appendChild(h3);
                    let btn = document.createElement("button")
                    btn.classList.add("btn");
                    btn.classList.add("button");
                    btn.setAttribute('data-id', data.Search[i].imdbID);
                    btn.setAttribute('id', 'modal-btn');
                    let info = document.createTextNode('More Info');
                    btn.appendChild(info);
                    card.appendChild(btn);
                    main.appendChild(card);
                }
                if (Math.ceil(data.totalResults / 10) > page) {
                    const loadBtn = document.createElement("button")
                    loadBtn.classList.add("load-btn");
                    loadBtn.setAttribute('data-page', ++page);
                    let info = document.createTextNode('Load More');
                    loadBtn.appendChild(info)
                    main.appendChild(loadBtn);
                    loadBtn.addEventListener('click', function (e) {
                        fetchResult(e.target.dataset.page);
                    });
                }
            }

        }
    }
    xhr.send();
}

// Function for more info 

function moreInfo(e) {
    if (e.target.classList.contains('btn')) {
        const imdbID = e.target.dataset.id;
        fetchInfo(imdbID);
    }
}

function fetchInfo(imdbID) {
    let xhr = new XMLHttpRequest();
    let url = `https://www.omdbapi.com/?apikey=${apikey}&i=${imdbID}&plot=full`;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 2) {
            // for use in Future
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
            let data = JSON.parse(xhr.response);
            let myModal = document.createElement('div');
            myModal.setAttribute('id', 'my-modal');
            myModal.classList.add('modal');
            let modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');
            let modalHeader = document.createElement('div');
            modalHeader.classList.add('modal-header');
            let spanClose = document.createElement('span');
            spanClose.classList.add('close');
            let closeContent = document.createTextNode('x');
            spanClose.appendChild(closeContent);
            modalHeader.appendChild(spanClose);
            modalContent.appendChild(modalHeader);
            let modalBody = document.createElement('div');
            modalBody.classList.add('modal-body');
            let textBody = document.createElement('div');
            // All data append here 
            // we will look to this later
            // Object.keys(data).forEach(e => console.log(`key=${e}  value=${data[e]}`));
            for (const [key, value] of Object.entries(data)) {
                if (key == 'Response' || key == 'Type') {
                    continue;
                }
                if (key == 'Ratings') {
                    let ratings = document.createElement('h3');
                    let textratings = document.createTextNode('Ratings :');
                    ratings.appendChild(textratings);
                    textBody.appendChild(ratings);
                    for (let i = 0; i < value.length; i++) {

                        let h3 = document.createElement('h3');
                        h3.classList.add('ratings-i');
                        let textValue = document.createTextNode(`${data.Ratings[i].Source} : ${data.Ratings[i].Value}`);
                        h3.appendChild(textValue);
                        textBody.appendChild(h3);
                    }
                    continue;
                }
                if (key == 'Title') {

                    let h2 = document.createElement('h2');
                    let headerTitle = document.createTextNode(value);
                    h2.appendChild(headerTitle);
                    modalHeader.appendChild(h2);
                    continue;
                }
                if (key == 'Poster') {
                    let img = document.createElement("img");
                    img.setAttribute('height', '320px');
                    img.setAttribute('width', '310px');
                    img.setAttribute('alt', 'Poster');
                    img.setAttribute('class', 'poster');
                    img.src = value != "N/A" ? value : "no-poster.jpg";
                    textBody.prepend(img);
                    continue;
                }
                let h3 = document.createElement('h3');
                let textValue = document.createTextNode(`${key} : ${value}`);
                h3.appendChild(textValue);
                textBody.appendChild(h3);
            }

            modalBody.appendChild(textBody);
            modalContent.appendChild(modalBody);
            modalContent.appendChild(modalBody);
            myModal.appendChild(modalContent);
            main.appendChild(myModal);
            const modal = document.querySelector('#my-modal');
            const modalBtn = document.querySelector('#modal-btn');
            const closeBtn = document.querySelector('.close');

            modal.style.display = 'block';


            document.getElementById('my-modal').scrollIntoView();
            closeBtn.addEventListener('click', closeModal);

            // Events
            modalBtn.addEventListener('click', openModal);
            window.addEventListener('click', outsideClick);

            // Open
            function openModal() {
                modal.style.display = 'block';
                closeBtn.addEventListener('click', closeModal);
            }

            // Close
            function closeModal() {
                myModal.parentNode.removeChild(myModal);
            }

            // Close If Outside Click
            function outsideClick(e) {
                if (e.target == modal) {
                    myModal.parentNode.removeChild(myModal);
                }
            }
        }

    }

    xhr.send();
}