// Strict mode
// Modo estrito
"use strict";

// Creating products array
// Criando array de produtos
const productsArray = [
    {
        id: 1,
        src: "assets/images/cloth-1.jpg",
        name: "Cloth",
        price: 150,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti."
    },
    {
        id: 2,
        src: "assets/images/cloth-2.jpg",
        name: "Cloth",
        price: 100,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti."
    },
    {
        id: 3,
        src: "assets/images/cloth-3.jpg",
        name: "Cloth",
        price: 150,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti."
    },
    {
        id: 4,
        src: "assets/images/phone-1.jpg",
        name: "Phone",
        price: 300,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti."
    },
    {
        id: 5,
        src: "assets/images/phone-2.jpg",
        name: "Phone",
        price: 300,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti."
    },
    {
        id: 6,
        src: "assets/images/shoe-1.jpg",
        name: "Shoe",
        price: 100,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti."
    },
    {
        id: 7,
        src: "assets/images/shoe-2.jpg",
        name: "Shoe",
        price: 100,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti."
    },
    {
        id: 8,
        src: "assets/images/shoe-3.jpg",
        name: "Shoe",
        price: 250,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti."
    },
];

// Selecting elements
// Selecionando elementos
const counter = document.querySelector(".heading .cart-icons .counter");
const cartContainer = document.querySelector(".heading .items-container .items");
const emptyText = document.querySelector(".heading .items-container .empty-text");
const buyBtn = document.querySelector(".heading .items-container .buy-btn");
const content = document.querySelector(".content");

// Variable for the product list starting with an empty array
// Variável para a lista de produtos iniciando com um array vazio
let productsList = [];

// Variable for the product cart starting with an empty array
// Variável para o carrinho de produtos iniciando com um array vazio
let productsCart = [];

// Function to display products on the page
// Função para exibir produtos na página  
function loadProductsInDocument() {
    productsList = productsArray;
    content.innerHTML = "";

    if(productsList.length > 0) {
        productsList.forEach((product) => {
            let newProduct = document.createElement("div");
            newProduct.classList.add("card");
            newProduct.dataset.id = product.id;
            newProduct.dataset.name = product.name;
            newProduct.innerHTML = `
            <img src="${product.src}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <span>$${product.price}</span>
            </div>
            <p>${product.description}</p>
            <button type="button" class="add-cart">Add to cart</button>`;
            content.appendChild(newProduct);
        });
    }
}
loadProductsInDocument();   

// Selecting the add to cart button in the content and assigning a function
// Selecionando o botão adicionar ao carrinho no conteúdo e atribuindo uma função
content.addEventListener("click", function(event) {
    const element = event.target;
    if(element.classList.contains("add-cart")) {
        let productId = element.parentElement.dataset.id;
        addToCart(productId);
    }
});

// Function to add to cart
// Função para adicionar ao carrinho
function addToCart(productId) {
    let positionId = productsCart.findIndex((value) => value.productId == productId);

    if(productsCart.length <= 0) {
        productsCart = [{
            productId: productId,
            quantity: 1
        }]
    }
    else if(positionId < 0) {
        productsCart.push({
            productId: productId,
            quantity: 1
        });
    }
    else {
        productsCart[positionId].quantity = productsCart[positionId].quantity + 1;
    }
    loadProductsInCart();
    addCartToMemory();
}

// Function to save the product cart to local storage
// Função para salvar o carrinho de produtos no armazenamento local
function addCartToMemory() {
    localStorage.setItem("cart", JSON.stringify(productsCart));
}

// Function so that products remain saved in the cart (if you have products in the cart)
// Função para que os produtos permaneçam salvos no carrinho (caso tenha produtos no carrinho) 
function saveProductsInCart() {
    if(localStorage.getItem("cart")) {
        productsCart = JSON.parse(localStorage.getItem("cart"));
    } 
    loadProductsInCart();
}
saveProductsInCart();

// Function to display/add products to cart
// Função para exibir/adicionar produtos no carrinho
function loadProductsInCart() {
    cartContainer.innerHTML = "";

    if(productsCart.length === 0) {
        emptyText.textContent = "Your cart is empty";
        buyBtn.style.display = "none";
    }
    else if(productsCart.length > 0) {
        productsCart.forEach((cart) => {
            let newCart = document.createElement("div");
            newCart.classList.add("item");
            newCart.dataset.id = cart.productId;
            let positionCartId = productsList.findIndex((value) => value.id == cart.productId);
            let info = productsList[positionCartId]; 
            newCart.innerHTML = `
                <img src="${info.src}" alt="${info.name}">
                <div>
                    <h3>${info.name}</h3>
                    <span class="price">$${info.price * cart.quantity}</span>
                    <div class="icons">
                        <i class="fa fa-minus"></i>
                        <span>${cart.quantity}</span>
                        <i class="fa fa-plus"></i>
                    </div>
                </div>
            <i class="fa fa-times"></i>`;    
            cartContainer.appendChild(newCart);  
        });
        emptyText.textContent = "Your cart";
        buyBtn.style.display = "block";
    }
    counter.textContent = productsCart.length;
}

// Selecting the add, remove and delete products buttons in the cart and assigning a function
// Selecionando os botões adicionar, remover e excluir produto no carrinho e atribuindo uma função
cartContainer.addEventListener("click", function(event) {
    let element = event.target;
    
    if(element.classList.contains("fa-minus") || element.classList.contains("fa-plus")) {
        let productId = element.parentElement.parentElement.parentElement.dataset.id;
        let type = "fa-minus";
        if(element.classList.contains("fa-plus")) {
            type = "fa-plus";
        }
        changeQuantity(productId, type);
    }
    else if(element.classList.contains("fa-times")) {
        let productId = element.parentElement.dataset.id;
        removeProductsFromCart(productId);
    }  
    addCartToMemory();
});  

// Function to increase and decrease quantity of product in the cart
// Função para aumentar e diminuir quantidade de produto no carrinho
function changeQuantity(productId, type) {
    let positionItemInCart = productsCart.findIndex((value) => value.productId == productId);
    if(positionItemInCart >= 0) {
        switch(type) {
            case "fa-plus":
                productsCart[positionItemInCart].quantity = productsCart[positionItemInCart].quantity + 1;
                break;
            default:
                let valueChange = productsCart[positionItemInCart].quantity - 1;
                if(valueChange > 0) {
                    productsCart[positionItemInCart].quantity = valueChange;
                }
                else {
                    productsCart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    loadProductsInCart();
}

// Function to remove products from the cart
// Função para remover produto do carrinho
function removeProductsFromCart(productId) {
    let positionProductInCart = productsCart.findIndex((value) => value.productId == productId);
    
    if(positionProductInCart >= 0) {
        productsCart.splice(positionProductInCart, 1);
    }
    loadProductsInCart();
}

// Selecting elements
// Selecionando elementos
const input = document.querySelector(".heading .input-box input");
const filterButton = document.querySelector(".heading .input-box button");
const cartIcon = document.querySelector(".heading .cart-icons .fa-cart-shopping");
const productsContainer = document.querySelector(".heading .items-container");

const productCards = document.querySelectorAll(".card");
productCards.forEach((card) => card.classList.remove("active"));

// Function to filter products
// Função para filtrar produtos 
function filterProducts() {
    if(input.value) {
        productCards.forEach((card) => {
            let dataName = card.getAttribute("data-name").toLowerCase();
            if(dataName.includes(input.value.toLowerCase())) {
                card.classList.remove("active");
            }
            else {
                card.classList.add("active");
            }
        });
    }
}

// Function to filter products by pressing the ENTER key
// Função para filtrar produtos pressionando a tecla ENTER
input.addEventListener("keydown", (event) => {
    if(event.code === "Enter") {
        filterProducts();
    }
});

// Function to display products if the input field is empty
// Função para exibir produtos se o campo de entrada estiver vazio
input.addEventListener("input", () => {
    if(!input.value) {
        productCards.forEach((card) => card.classList.remove("active"));
    }
});

// Function to show or hide the product cart
// Função para exibir ou ocultar o carrinho de produtos
function toggleCart() {
    productsContainer.classList.toggle("open");
}

// Events
// Eventos
buyBtn.addEventListener("click", (event) => event.preventDefault());
cartIcon.addEventListener("click", toggleCart);
filterButton.addEventListener("click", filterProducts);