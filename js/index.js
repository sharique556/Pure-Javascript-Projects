let menuList = document.querySelector('#menuList');
menuList.style.maxHeight = "0px";

let filterRightPopup = document.querySelector(".right-popup");
filterRightPopup.style.display = "none";

let productElem = document.querySelector(".products");

// API Endpoint
const API_ENDPOINT = "https://fakestoreapi.com/products";

// Error elements
const ERROR_ELEMENT = `<div class="error-dv">
        <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#5f6368"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
        </div><div class="error-ui"><h1>Oops! Something went wrong</h1></div>`;

// Display products
const renderProductsElements = (elem) => {
    return `<div class="items">
                            <img loading="lazy" src=${elem?.image} data-src=${elem?.image} alt=${elem?.title}>
                            <p>Rs${elem?.price} | ${elem?.rating?.rate}</p>
                            <p>${elem?.category?.toUpperCase()}</p>
                            <h3>${elem?.title}</h3>
                        </div>`
}

// Html element for sorted elements
const sortedElements = (elem) => {
    return `<div class="items">
                                    <img loading="lazy" src=${elem?.image} data-src=${elem?.image} alt=${elem?.title}>
                                    <p>Rs ${elem?.price} | ${elem?.rating?.rate}</p>
                                    <p>${elem?.category?.toUpperCase()}</p>
                                    <h3>${elem?.title}</h3>
                                </div>`
}
let distinctCategory = []


// Toggling menu bar
function handleMenu() {
    if (menuList.style.maxHeight === "0px") {
        menuList.style.maxHeight = "400px"
    } else {
        menuList.style.maxHeight = "0px"
    }
}

// Toggling Features in mobile view
function handleFilter() {
    if (filterRightPopup.style.display === 'none') {
        filterRightPopup.style.display = 'block';
    } else {
        filterRightPopup.style.display = 'none';
    }
}

// Displaying data after filter
const displayProducts = (str) => {
    productElem.innerHTML = "";
    dataArray = JSON.parse(localStorage.getItem('display_data')) || [];
    let newDataArray = [];
    dataArray.forEach((elem) => {
        if (elem.title.toLowerCase().includes(str.toLowerCase()) || elem.category.toLowerCase().includes(str.toLowerCase())) {
            newDataArray = [...newDataArray, elem]
            productElem.innerHTML += `<div class="items">
                            <img loading="lazy" src=${elem?.image} data-src=${elem?.image} alt=${elem?.title}>
                            <p>Rs ${elem?.price} | ${elem?.rating?.rate}</p>
                            <p>${elem?.category?.toUpperCase()}</p>
                            <h3>${elem?.title}</h3>
                        </div>`
        }
    })
    localStorage.setItem('display_data', JSON.stringify(newDataArray))
}


// Calling api
const getAllProducts = async (checkedCat = []) => {
    let displayedData = []
    let filterCategoryDiv = document.querySelector(".filter-category")
    let filterCategoryDivSide = document.querySelector(".filter-category-sidenav")
    // filterCategoryDiv.innerHTML = "";
    try {
        productElem.innerHTML = `<div class="loaderDiv"><div class="loader"></div><div><p>...loading</p><div></div>`;
        // document.querySelector(".loaderDiv").style.minHeight = "800px";
        const data = await fetch(API_ENDPOINT)
        const product_list = await data?.json()
        if (product_list?.length) {
            let loaderDiv = document.querySelector(".loaderDiv")
            loaderDiv.style.display = "none"
            product_list?.forEach((elem, i) => {
                // Display checkbix of distinct categories
                if (!distinctCategory.includes(elem?.category)) {
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

                // Put all the data of the checkboxes
                if (checkedCat?.length == 0) {
                    checkedCat = distinctCategory;
                }

                if (checkedCat.includes(elem?.category)) {
                    displayedData = [...displayedData, elem]
                    // Display products 
                    productElem.innerHTML += renderProductsElements(elem)
                }
            })
        }
        localStorage.setItem("display_data", JSON.stringify(displayedData))

    } catch (err) {
        productElem.innerHTML = ERROR_ELEMENT;
        throw new Error("Something went wrong.");
    }

}

// Calling products api
getAllProducts()

// Handle checkbox for filtering
const handleCategoryFilter = () => {
    let searchElem = document.querySelectorAll(".searchInputField")
    if (searchElem.length) {
        searchElem.forEach((elem) => {
            elem.value = ""
        })
    }
    let checkInput = document.querySelectorAll("input[type='checkbox']");
    let checkData = [];
    checkInput.forEach((e) => {
        if (e.checked) {
            checkData.push(e.value)
        }
    })
    getAllProducts(checkData)

}

// Handling Search input
const handleInputField = (e) => {
    const typedStr = e.target.value;
    displayProducts(typedStr)
}

// Debounce function rate limit the typed keyword
let debounce = function (fn, delay) {
    let timer
    return function () {
        let context = this;
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, delay)
    }
}

// Limiting the search string by 1000 secs
let searchElem = document.querySelectorAll(".searchInputField")
if (searchElem.length) {
    searchElem.forEach((elem) => {
        elem.addEventListener("keyup", debounce(handleInputField, 1000))
    })
}


// Display sorted products based on selection value
const renderSortedProducts = (selected_value, data) => {
    switch (selected_value) {
        case 'lowest':
            let lowestPrice = data.sort((a, b) => {
                return a.price - b.price
            })
            lowestPrice.forEach((elem) => {
                productElem.innerHTML += sortedElements(elem)
            })
            break;
        case 'highest':
            let highest = data.sort((a, b) => {
                return b.price - a.price
            })
            highest.forEach((elem) => {
                productElem.innerHTML += sortedElements(elem)
            })
            break;
        case 'rating_lowest':
            let lowestRating = data.sort((a, b) => {
                return a?.rating?.rate - b?.rating?.rate
            })
            lowestRating.forEach((elem) => {
                productElem.innerHTML += sortedElements(elem)
            })
            break;
        case 'rating_highest':
            let highestRating = data.sort((a, b) => {
                return b?.rating?.rate - a?.rating?.rate
            })
            highestRating.forEach((elem) => {
                productElem.innerHTML += sortedElements(elem)
            })
            break;
        default:
            break;
    }
}

// Sorting logic
let sortSelection = document.querySelectorAll("#sort")
sortSelection.forEach((elem) => {
    elem.addEventListener('change', function () {
        const selected_value = this.value;
        let data = JSON.parse(localStorage.getItem('display_data'));
        productElem.innerHTML = ""
        // Display sorted data
        renderSortedProducts(selected_value, data)
    })
})