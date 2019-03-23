var xhr = new XMLHttpRequest();
xhr.open("GET" , "https://www.omdbapi.com/?apikey=eaa8df42&i=tt4154756", true);
xhr.onreadystatechange = function(){
    console.log('Ready State Changed' , xhr,this.readyState);

    if(xhr.readyState == 4){
        console.log(xhr.responseText);
    }
}
xhr.send();
