console.log('Connected! .');

const apikey ='eaa8df42';
const target = document.getElementById('main');
const form = document.getElementById('searchForm');
const searchString = form.querySelector("#search");
const y = form.querySelector("input[type='number']");
const type = form.querySelector("select");
form.addEventListener('submit' , function(e){
    e.preventDefault();
    ajaxSearch();
});
target.addEventListener("click" , mainClick);
function mainClick(e){
    if(e.target.classList.contains('btn')){
        console.log(e.target.dataset.id);
    }
}
function navClickListener(e){
    if(e.target.classList.contains('nav-link')){
        navSearch(e.target.dataset.pagenum);

    }
}
function nav(total , page){
    
    for(let result = total , i = 1 ; result > 0 ; result = result-10 , i++){
        
        // var loadBtn = document.createElement("button") 
        // loadBtn.classList.add("load-btn");
        // loadBtn.setAttribute('data-page' , page+1);
        // var info = document.createTextNode('Load More');
        // loadBtn.appendChild(info)
        // target.appendChild(loadBtn);  
    }
}

function navSearch(page){
    ajaxSearch(page);
}

// Main Function get search result
function ajaxSearch(page = 1){
    var xhr = new XMLHttpRequest();
    var url = `https://www.omdbapi.com/?apikey=${apikey}&s=${searchString.value}&y=${year.value}&type=${typeValue = type.value != 'All' ? type.value : ""}`;
    if(page != 1){
        url += '&page=' + page;
        console.log(url);
        let loadBtn = document.querySelector('.load-btn');
        loadBtn.parentNode.removeChild(loadBtn);
    }
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      console.log('Ready state Change: ' + xhr.readyState);
      if (xhr.readyState == 2) {
          loading = document.createElement('div');
          let loadingText = document.createTextNode('Loading Please Wait..');
          loading.appendChild(loadingText);
          main.appendChild(loading);
        console.log('State Change ', xhr.readyState);
      }
      if (xhr.readyState == 4 && xhr.status == 200){
          loading.parentNode.removeChild(loading);
          console.log(xhr.responseText);
          data = JSON.parse(xhr.response);
        //   console.log(data.Search);
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
          btn.setAttribute('data-id' , data.Search[i].imdbID);
          let info = document.createTextNode('More Info');
          btn.appendChild(info);
          card.appendChild(btn);
          target.appendChild(card);
          }
          if(Math.ceil(data.totalResults/10) > page ){
            const loadBtn = document.createElement("button") 
            loadBtn.classList.add("load-btn");
            loadBtn.setAttribute('data-page' , ++page);
            let info = document.createTextNode('Load More');
            loadBtn.appendChild(info)
            target.appendChild(loadBtn); 
            loadBtn.addEventListener('click' ,function(e){
                ajaxSearch(e.target.dataset.page);
            });
          }
      }
      
    }
    xhr.send();

}


//$output=file_get_contents(`http://www.omdbapi.com/?apikey=${apikey}&s=${searchString.value}`);

// async function fetchData(){
//     const res = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&s=${searchString.value}`);
//     const json = await res.json();
// }