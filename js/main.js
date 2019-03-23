// console.log('Connected');

const apikey = 'eaa8df42';
const main = document.getElementById('main');
const form = document.getElementById('searchForm');
const searchString = form.querySelector("#search");
const y = form.querySelector("input[type='number']");
const type = form.querySelector("select");

// This is just for initialisation 
let sValue ="";
let yearValue ="";
let typeValue ="";

// loading text htmlElement //#endregion
let loading=null;
let loadingText = "";

// search Form Listener
form.addEventListener('submit' ,  function(e){
    // console.log('Entered');
    e.preventDefault();
    // because if after submitting form if user change value it wont cause to load more Results.
    sValue = searchString.value; 
    yearValue = y.value;
    typeValue = type.value;
    // Clear Main Area
    while (main.firstChild) {
    main.removeChild(main.firstChild);
}
    console.log(main);   

    fetchResult();
});

// Main Function for fetching search result

function fetchResult(page = 1){
    let xhr = new XMLHttpRequest();
    let url = 'https://www.omdbapi.com/?apikey=' + apikey + '&s=' + sValue + '&y=' + yearValue + '&type=' + typeValue + '&page=' +page ;
    if(page != 1){
        // Remove Load More Button
        let loadBtn = document.querySelector('.load-btn');
        loadBtn.parentNode.removeChild(loadBtn);
    }
    xhr.open("GET" , url , true);
    xhr.onreadystatechange = function(){
        // console.log('Ready State Change :' , xhr.readyState);
        if(xhr.readyState == 2){
            // because we want to delete this in different block
            loading = document.createElement('div');
            loadingText = document.createTextNode('Loading Please Wait...');
            loading.appendChild(loadingText);
            main.appendChild(loading);
        }
        if(xhr.readyState == 4 && xhr.status == 200){
            // Remove Loading Text
            loading.parentNode.removeChild(loading);
            // For Testing Purpose
            // console.log(xhr.responseText);
            
            data = JSON.parse(xhr.response);
          //   // console.log(data.Search);
            for(let i=0 ,length = data.Search.length; i<length ; i++){  
            let card = document.createElement("div");
            card.classList.add("card");
            let img = document.createElement("img");
            img.setAttribute('height' , '320px');
            img.setAttribute('width' , '100%');
            img.setAttribute('alt' , data.Search[i].Title);
            img.setAttribute('class' , 'poster');
            img.src = data.Search[i].Poster != "N/A" ? data.Search[i].Poster : "no-poster.jpg";
            card.appendChild(img);
            let h2 = document.createElement("h2");
            h2.classList.add("title");
            let title = document.createTextNode(data.Search[i].Title);
            // Font size on basis of title length so long title dont mess card layout
            if(title.length > 20){
                h2.style.fontSize = ".9rem";
            }
            h2.appendChild(title);
            card.appendChild(h2);
            let h3 = document.createElement("h3");
            h3.classList.add("year");
            let year = document.createTextNode('Year : '+data.Search[i].Year);
            h3.appendChild(year);
            card.appendChild(h3);
            h3 = document.createElement("h3");
            h3.classList.add("type");
            let type = document.createTextNode('Type : '+data.Search[i].Type);
            h3.appendChild(type);
            card.appendChild(h3);
            let btn = document.createElement("button") 
            btn.classList.add("btn");
            btn.classList.add("button");
            btn.setAttribute('data-id' , data.Search[i].imdbID);
            btn.setAttribute('id' , 'modal-btn');
            let info = document.createTextNode('More Info  (Coming soon )');
            btn.appendChild(info);
            card.appendChild(btn);
            main.appendChild(card);
            }
            if(Math.ceil(data.totalResults/10) > page ){
              const loadBtn = document.createElement("button") 
              loadBtn.classList.add("load-btn");
              loadBtn.setAttribute('data-page' , ++page);
              let info = document.createTextNode('Load More');
              loadBtn.appendChild(info)
              main.appendChild(loadBtn); 
              loadBtn.addEventListener('click' ,function(e){
                  fetchResult(e.target.dataset.page);
              });
            }
        }
    }
    xhr.send();
}
