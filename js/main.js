console.log('Connected! .');

const apikey ='eaa8df42';
let target = document.getElementById('main');
let form = document.getElementById('searchForm');
console.log(form);
let searchString = form.querySelector("#search");
let y = form.querySelector("input[type='number']");
let type = form.querySelector("select");
// let y = form.getElementById('year');
// let searchString = form.getElementById('search');
// let type = form.getElementById('type');
form.addEventListener('submit' , search);
target.addEventListener("click" , mainClick);
function mainClick(e){
    if(e.target.classList.contains('btn')){
        console.log(e.target.dataset.id);
    }
}
function search(e){
    e.preventDefault();
    ajaxSearch();
}

function ajaxSearch(){
    var xhr = new XMLHttpRequest();
    let url = `https://www.omdbapi.com/?apikey=${apikey}&s=${searchString.value}&y=${year.value}&type=${typeValue = type.value != 'All' ? type.value : ""}`;
    console.log(url);
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      console.log('Ready state Change: ' + xhr.readyState);
      if (xhr.readyState == 2) {
        target.innerHTML = "Loading...";
      }
      if (xhr.readyState == 4 && xhr.status == 200){
          target.innerHTML =null;
          console.log(xhr.responseText);
          data = JSON.parse(xhr.response);
          console.log(data.Search);
          for(let i=0 ,length = data.Search.length; i<length ; i++){  
          var card = document.createElement("div");
          card.classList.add("card");
          var img = document.createElement("img");
          img.setAttribute('height' , '320px');
          img.setAttribute('width' , '100%');
          img.setAttribute('alt' , data.Search[i].Title);
          img.setAttribute('class' , 'poster');
          img.src = data.Search[i].Poster != "N/A" ? data.Search[i].Poster : "no-poster.jpg";
          card.appendChild(img);
          var h2 = document.createElement("h2");
          h2.classList.add("title");
          var title = document.createTextNode(data.Search[i].Title);
          if(title.length > 20){
              h2.style.fontSize = ".9rem";
          }
          h2.appendChild(title);
          card.appendChild(h2);
          var h3 = document.createElement("h3");
          h3.classList.add("year");
          var year = document.createTextNode('Year : '+data.Search[i].Year);
          h3.appendChild(year);
          card.appendChild(h3);
          var h3 = document.createElement("h3");
          h3.classList.add("type");
          var type = document.createTextNode('Type : '+data.Search[i].Type);
          h3.appendChild(type);
          card.appendChild(h3);
          var btn = document.createElement("button") 
          btn.classList.add("btn");
          btn.setAttribute('data-id' , data.Search[i].imdbID);
          var info = document.createTextNode('More Info');
          btn.appendChild(info);
          card.appendChild(btn);
          target.appendChild(card);
          }

      }
    }
    xhr.send();

}


//$output=file_get_contents(`http://www.omdbapi.com/?apikey=${apikey}&s=${searchString.value}`);

async function fetchData(){
    const res = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&s=${searchString.value}`);
    const json = await res.json();
}