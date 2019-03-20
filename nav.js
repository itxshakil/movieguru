var total =140;
function nav(total){
    for(let i = total , nav = 1 ; i > 0 ; i = i-10 , nav++){
        document.body.innerHTML = document.body.innerHTML + nav; 
    }
}

nav(total);