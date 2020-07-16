var apikey = 'eaa8df42';
var main = document.getElementById('main');
var searchForm = document.getElementById('searchForm');
var searchInput = searchForm.querySelector("#search");
var y = searchForm.querySelector("input[type='number']");
var type = searchForm.querySelector("select");
var cardwrapper = createElement("div", "card-wrapper");
main.addEventListener('click', mainClicked);
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearPreviousResult();
    if (searchInput.value.trim().length === 0) {
        showMessage("Please enter movie name");
        return false;
    }
    fetchResult();
});
function clearPreviousResult() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}
function removeLoadMoreBtn() {
    var loadBtn = document.querySelector('.load-btn');
    loadBtn.parentNode.removeChild(loadBtn);
}
function showLoadingText() {
    var loading = createElement('div', 'loading');
    var loadingText = document.createTextNode('Loading Please Wait...');
    loading.appendChild(loadingText);
    main.appendChild(loading);
}
function removeLoading() {
    var loading = document.querySelector('div.loading');
    loading.parentNode.removeChild(loading);
}
function fetchResult(page) {
    if (page === void 0) { page = 1; }
    var name = searchInput.value.trim();
    var year = y.value;
    var searchType = type.value;
    var url = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + name + "&y=" + year + "&type=" + searchType + "&page=" + page;
    if (page != 1)
        removeLoadMoreBtn();
    showLoadingText();
    fetch(url)
        .then(function (response) {
        response.json()
            .then(function (data) {
            removeLoading();
            handleResult(data, page);
        })["catch"](function (err) {
            showMessage(err);
        });
    })["catch"](function () {
        showMessage("Some error occured");
    });
}
function createElement(tagName) {
    var _a;
    var classes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        classes[_i - 1] = arguments[_i];
    }
    var element = document.createElement(tagName);
    (_a = element.classList).add.apply(_a, classes);
    return element;
}
function createCardElement(item) {
    var card = createElement("div", "card");
    var img = createElement("img", "poster");
    img.setAttribute("height", "320px");
    img.setAttribute("width", "100%");
    img.setAttribute("alt", item.Title);
    img.setAttribute("loading", "lazy");
    img.src = item.Poster != "N/A" ? item.Poster : "no-poster.jpg";
    card.appendChild(img);
    var h2 = createElement("h2");
    var title = document.createTextNode(item.Title);
    h2.appendChild(title);
    card.appendChild(h2);
    var h3 = createElement("h3");
    var year = document.createTextNode("Year : " + item.Year);
    h3.appendChild(year);
    card.appendChild(h3);
    h3 = createElement("h3");
    var type = document.createTextNode("Type : " + item.Type);
    h3.appendChild(type);
    card.appendChild(h3);
    var btn = createElement("button", "model-btn");
    btn.setAttribute('data-id', item.imdbID);
    btn.setAttribute('id', 'modal-btn');
    var info = document.createTextNode('More Info');
    btn.appendChild(info);
    card.appendChild(btn);
    return card;
}
function handleResult(data, page) {
    if (data.Response === 'False') {
        showMessage(data.Error);
    }
    else {
        for (var i = 0, length_1 = data.Search.length; i < length_1; i++) {
            var card = createCardElement(data.Search[i]);
            cardwrapper.appendChild(card);
        }
        main.appendChild(cardwrapper);
        if (Math.ceil(data.totalResults / 10) > page) {
            var loadBtn = createElement("button", "load-btn");
            loadBtn.setAttribute('data-page', ++page);
            var info = document.createTextNode('Load More');
            loadBtn.appendChild(info);
            main.appendChild(loadBtn);
        }
    }
}
function showMessage(errorText) {
    var h3 = createElement('h3');
    var error = document.createTextNode(errorText);
    h3.appendChild(error);
    main.appendChild(h3);
}
function mainClicked(event) {
    var target = event.target;
    if (target.classList.contains('model-btn')) {
        var imdbID = target.dataset.id;
        fetchInfo(imdbID);
    }
    if (target.classList.contains('load-btn')) {
        fetchResult(parseInt(target.dataset.page));
    }
}
function showModal() {
    var modal = document.querySelector('#my-modal');
    var closeBtn = modal.querySelector('.close');
    modal.style.display = 'block';
    modal.scrollIntoView();
    closeBtn.addEventListener('click', function () {
        modal.parentNode.removeChild(modal);
    });
}
function createModal(data) {
    var myModal = createElement('div', 'modal');
    myModal.setAttribute('id', 'my-modal');
    var modalHeader = createElement('div', 'modal-header');
    var spanClose = createElement('span', 'close');
    var closebtn = document.createTextNode('x');
    spanClose.appendChild(closebtn);
    modalHeader.appendChild(spanClose);
    var modalBody = createElement('div', 'modal-body');
    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (key == 'Response' || key == 'Type') {
            continue;
        }
        if (key == 'Ratings') {
            var ratings = createElement('h3');
            var textratings = document.createTextNode('Ratings :');
            ratings.appendChild(textratings);
            modalBody.appendChild(ratings);
            for (var i = 0; i < value.length; i++) {
                var h3_1 = createElement('h3', "ratings-" + i);
                var textValue_1 = document.createTextNode(data.Ratings[i].Source + " : " + data.Ratings[i].Value);
                h3_1.appendChild(textValue_1);
                modalBody.appendChild(h3_1);
            }
            continue;
        }
        if (key == 'Title') {
            var h2 = createElement('h2');
            var headerTitle = document.createTextNode(value);
            h2.appendChild(headerTitle);
            modalHeader.appendChild(h2);
            continue;
        }
        if (key == 'Poster') {
            var img = createElement("img");
            img.setAttribute('height', '320px');
            img.setAttribute('width', '310px');
            img.setAttribute('alt', 'Poster');
            img.setAttribute('class', 'poster');
            img.src = value != "N/A" ? value : "no-poster.jpg";
            modalBody.prepend(img);
            continue;
        }
        var h3 = document.createElement('h3');
        var textValue = document.createTextNode(key + " : " + value);
        h3.appendChild(textValue);
        modalBody.appendChild(h3);
        myModal.appendChild(modalHeader);
        myModal.appendChild(modalBody);
        main.appendChild(myModal);
    }
}
function fetchInfo(imdbID) {
    var url = "https://www.omdbapi.com/?apikey=" + apikey + "&i=" + imdbID + "&plot=full";
    fetch(url).then(function (response) {
        response.json().then(function (data) {
            createModal(data);
            showModal();
        });
    });
}
