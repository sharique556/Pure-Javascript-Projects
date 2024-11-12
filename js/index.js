let menuList = document.querySelector('#menuList');
menuList.style.maxHeight = "0px";

let filterRightPopup = document.querySelector(".right-popup");
filterRightPopup.style.display = "none";

let productElem = document.querySelector(".products");


function handleMenu(){
    if(menuList.style.maxHeight === "0px"){
        menuList.style.maxHeight = "400px"
    }else{
        menuList.style.maxHeight = "0px"
    }
}

function handleFilter(){
    if(filterRightPopup.style.display === 'none'){
        filterRightPopup.style.display = 'block';
    }else{
        filterRightPopup.style.display = 'none';
    }
}

const API_ENDPOINT = "https://fakestoreapi.com/products";
let distinctCategory = []

// Displaying data after filter
const displayProducts = (str) => {
    productElem.innerHTML="";
    dataArray = JSON.parse(localStorage.getItem('display_data')) || [];
    dataArray.forEach((elem)=>{
        if(elem.title.toLowerCase().includes(str.toLowerCase()) ||elem.category.toLowerCase().includes(str.toLowerCase())){
            productElem.innerHTML += `<div class="items">
                            <img src=${elem?.image} alt=${elem?.title}>
                            <p>${elem?.price} | ${elem?.rating?.rate}</p>
                            <p>${elem?.category?.toUpperCase()}</p>
                            <h3>${elem?.title}</h3>
                        </div>`
        }
    })
}


// Calling api
const getAllProducts = async (checkedCat=[]) => {
    let displayedData = []
    let filterCategoryDiv = document.querySelector(".filter-category")
    let filterCategoryDivSide = document.querySelector(".filter-category-sidenav")
    // filterCategoryDiv.innerHTML = "";
    try{
        productElem.innerHTML = `<div class="loaderDiv"><div class="loader"></div><h1>...loading</h1></div>`;
        document.querySelector(".loaderDiv").style.minHeight="800px";
        const data = await fetch(API_ENDPOINT)
        const product_list = await data?.json()
        if(product_list?.length){
            let loaderDiv = document.querySelector(".loaderDiv")
            loaderDiv.style.display="none"
            product_list?.forEach((elem,i)=>{
                // Display checkbix of distinct categories
                if(!distinctCategory.includes(elem?.category)){
                    filterCategoryDiv.innerHTML += `<label>
                        <input type="checkbox" onClick="handleCategoryFilter()" value="${elem?.category}">
                        ${elem?.category}
                    </label>`;
                    filterCategoryDivSide.innerHTML += `<label>
                        <input type="checkbox" onClick="handleCategoryFilter()" value="${elem?.category}">
                        ${elem?.category}
                    </label>`;
                    distinctCategory.push(elem?.category)
                }

                if(checkedCat?.length == 0){
                    checkedCat = distinctCategory;
                }
                
                if(checkedCat.includes(elem?.category) ){
                    displayedData = [...displayedData,elem]
                    
                // Display products 
                productElem.innerHTML += `<div class="items">
                            <img src=${elem?.image} alt=${elem?.title}>
                            <p>${elem?.price} | ${elem?.rating?.rate}</p>
                            <p>${elem?.category?.toUpperCase()}</p>
                            <h3>${elem?.title}</h3>
                        </div>`
                    }
            })
        } 
        localStorage.setItem("display_data",JSON.stringify(displayedData))
        
    }catch(err){
        productElem.innerHTML = `<div class="error-ui"><h1>Oops! Something went wrong</h1></div>`
        throw new Error("Something went wrong.");
    }
   
}
getAllProducts()

// Handle checkbox for filtering
const handleCategoryFilter = () => {
    let searchElem = document.querySelectorAll(".searchInputField")
    if(searchElem.length){
        searchElem.forEach((elem)=>{
            elem.value=""
        })
    }
    let checkInput = document.querySelectorAll("input[type='checkbox']");
    let checkData = [];
    checkInput.forEach((e)=>{
        if(e.checked){
            
            checkData.push(e.value)
        }
    })
    getAllProducts(checkData)
    
}

// Handling Search input
const handleInputField = (e) =>{
    const typedStr = e.target.value;
    displayProducts(typedStr)
}

let debounce = function(fn,delay){
    let timer 
    return function(){
        let context = this;
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(()=>{
            fn.apply(context,args)
        },delay)
    }
}

let searchElem = document.querySelectorAll(".searchInputField")
if(searchElem.length){
    searchElem.forEach((elem)=>{
        elem.addEventListener("keyup",debounce(handleInputField,1000))
    })
}