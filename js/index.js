let menuList = document.querySelector('#menuList');
menuList.style.maxHeight = "0px";

function handleMenu(){
    if(menuList.style.maxHeight === "0px"){
        menuList.style.maxHeight = "400px"
    }else{
        menuList.style.maxHeight = "0px"
    }
}