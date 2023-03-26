import { menuArray } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const orderInfo = document.getElementById("order-info");
const paymentWindow = document.getElementById("payment-window");
const paymentForm = document.getElementById("payment-form");
const thanksBlock = document.getElementById("thanks-block");

let totalPrice = 0;

document.addEventListener('click', function(e) {
    if (e.target.dataset.add) {
        addItem(e.target.dataset.add);
    } else if (e.target.dataset.remove) {
        removeItem(e.target.dataset.remove);
    } else if (e.target.id === "complete-order-btn") {
        showPaymentWindow();
    }
})

function addItem(itemId) {
    const item = menuArray.filter(function(menuItem) {
        return menuItem.id === itemId;
    })[0]
    totalPrice += item.price;
    const positionId = uuidv4();
    orderInfo.innerHTML += `
        <div class="order-position" id="${positionId}">
              <div class="name-remove">
                  <div class="order-name">
                      <h2>${item.name}</h2>
                  </div>     
                  <div class="remove-btn">
                     <p data-remove="${positionId}">remove</p>
                  </div>
              </div>
              <div><h4 class="price">$${item.price}</h4></div>
        </div>
    `
    renderPrice();
    document.getElementById("order").style.display = "block";
    thanksBlock.style.display = "none";
}

function removeItem(itemId) {
    const elementToRemove = document.getElementById(itemId);
    totalPrice -= elementToRemove.getElementsByClassName("price")[0].textContent.substring(1);
    elementToRemove.remove();
    renderPrice();
}

function showPaymentWindow() {
    paymentWindow.style.display = "block";
}

paymentForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = new FormData(paymentForm).get("name");
    renderThanks(name);
    paymentForm.reset();
    paymentWindow.style.display = "none";
    thanksBlock.style.display = "block";
    document.getElementById("order").style.display = "none";
    orderInfo.innerHTML = "";
    totalPrice = 0;
})

function getMenuHtml() {
    let menuHtml = ``;

    menuArray.forEach(function(menuItem) {
        menuHtml += `
        <div class="item">
                <div class="item-img">
                    <img src="images/${menuItem.img}" alt="${menuItem.name}">
                </div>
                <div class="item-info">
                    <h2 class="item-name">${menuItem.name}</h2>
                    <p class="ingredients">${menuItem.ingredients}</p>
                    <p class="price">$${menuItem.price} / <span>${menuItem.quantity} pcs</span></p>
                </div>
                <div class="add-item">
                    <button class="add-btn" data-add="${menuItem.id}"><span class="add-btn-text" data-add="${menuItem.id}">+</span></button>
                </div>
            </div>
        `
    })
    return menuHtml;
}

function renderMenu() {
    document.getElementById("menu-container").innerHTML = getMenuHtml();
}

function renderPrice() {
    document.getElementById("total-price").innerHTML = `$${totalPrice}`;
}

function renderThanks(name) {
    document.getElementById("thanks-text").innerHTML = `
    Thanks, ${name}! Your order is on its way!
    `
}

renderMenu();