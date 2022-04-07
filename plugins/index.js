const items = [
    { id: 1, img: "img/product-1.jpg", name: "Google Pixel 3 XL", price: 648},
    { id: 2, img: "img/product-2.jpg", name: "Google Pixel 2 XL", price: 500},
    { id: 3, img: "img/product-3.jpg", name: "Apple iPhone XR", price: 714},
    { id: 4, img: "img/product-4.jpg", name: "OnePlus 7 Pro", price: 327},
    { id: 5, img: "img/product-5.jpg", name: "Samsung Galaxy S10 Plus", price: 114},
    { id: 6, img: "img/product-6.jpg", name: "Samsung Galaxy Note 9", price: 170},
    { id: 7, img: "img/product-7.jpg", name: "Dell Alienware 17 R5 VR", price: 2300},
    { id: 8, img: "img/product-8.jpg", name: "MSI Gaming GT83 8RG-007IN", price: 5170},
    { id: 9, img: "img/product-9.jpg", name: "CHUWI HeroBook Pro 14.1", price: 439},
    { id: 10, img: "img/product-10.jpg", name: "Apple MacBook Air", price: 1150},
    { id: 11, img: "img/product-11.jpg", name: "ASUS ROG Zephyrus S17", price: 3200},
];
class Storage {
    static saveProduct(obj) {
        localStorage.setItem("products", JSON.stringify(obj));
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getProduct(id) {
        const products = JSON.parse(localStorage.getItem("products"))
        return products.find(product => product.id === parseFloat(id, 10))
    }

    static getCart() {
        const cart = localStorage.getItem("cart");
        return cart ? JSON.parse(cart) : {};
    }
}
//                                Массив сортировки по ценам
var pricesort = items.slice();
    pricesort.sort((a,b) => `${a.price}`.localeCompare(`${b.price}`, undefined, {numeric: true}));
var namesort = items.slice();
    namesort.sort((a,b) => `${a.name}`.localeCompare(`${b.name}`));
//                              Меню загрузки
var numscore = 0
var summary = 0;
var productsData = []
window.addEventListener("DOMContentLoaded", () => { 
    try{
        if (Storage.getProduct(1) != (null || undefined)) {
        productsData = JSON.parse(localStorage.getItem("products"))
        }
        if (localStorage.getItem("Score") != (null || undefined)) {
           numscore = localStorage.getItem("Score")
        }
    }
    catch {
    items.forEach(element => {
    productsData.push({ id : element.id, img: element.img, name: element.name, price: element.price, saved: false})
    Storage.saveProduct(productsData);
    })};
    //const productList = new Products();
    _createBasic(items);
    document.querySelector("#sort-by-price").addEventListener("click", () => {
        _createBasic(pricesort);
        modal.clean();
    })
    document.querySelector("#sort-by-name").addEventListener("click", () => {
        _createBasic(namesort);
        modal.clean();
    })
});

let block = document.createElement("div");
function _createBasic(array) { // Создание списка
   try { // Проверка на наличие активного списка, его очистка
        if (document.querySelector("main").childElementCount >= 3) {
            let cartblock = document.querySelector(".cart-block");
            for (let i = 0; i < 10; i++) {
                cartblock.childNodes.forEach (child => {
                    if (child.className == "cart__item") {
                    child.parentNode.removeChild(child);
                    }
                })
            }
            cartblock.remove()
        } else {
        throw "Новый блок";
        }
    }
    catch {};
//                                Создание списка товаров
    block.classList.add("cart-block");
    document.querySelector("main").appendChild(block);
    array.forEach(element => {
        let div = document.createElement("div");
            div.innerHTML = `
                <img src = "${element.img}" alt = "Ошибка загрузки фото" class = "images">
                <div class = "box" data-id = ${element.id}>
                    <div class = "box__text">Add to Cart</div>
                </div>
                <p class = "price">$${element.price}</p>
                <p class = "name">${element.name}</p>
            `;
        div.classList.add("cart__item");
        div.setAttribute("name", `${element.name}`);
        block.appendChild(div);
        if (Storage.getProduct(element.id).saved == true) {
            btn = div.querySelector(`.box`)
            btn.className = "disabled__btn";
            btn.setAttribute("tabindex", -1);
            let text = btn.firstElementChild;
            text.setAttribute("tabindex", -1);
            text.innerHTML = `Already in Cart!`;
        }
    });
};
var num = document.querySelector("#num");
num.innerHTML = `${localStorage.getItem("Score")}`
//                                 Взаимодействие товар-корзина
block.addEventListener("click", e => {
    if (e.target && e.target.nodeName == "DIV" && e.target.className != "disabled__btn") {
        try {
            cartData = Storage.getCart()
            let parentBox = e.target.closest("div[class=cart__item]")
            itemId = parentBox.querySelector(".box").getAttribute("data-id")
            itemTitle = parentBox.querySelector("p[class=name]").innerHTML
            itemPrice = parentBox.querySelector('p[class=price]').innerHTML
            itemImg = parentBox.querySelector("img").getAttribute("src")
            if(!cartData.hasOwnProperty(itemId)){ 
                cartData[itemId] = [itemTitle, itemPrice, 1, itemImg]
            }
            Storage.saveCart(cartData);
            let btn = e.target.closest("div[class=box]");
                btn.className = "disabled__btn";
                btn.setAttribute("tabindex", -1);
            let text = btn.firstElementChild;
                text.setAttribute("tabindex", -1);
                text.innerHTML = `Already in Cart!`;
            numscore++
            localStorage.setItem("Score", numscore)
            num.innerHTML = `${numscore}`;
            productsData[itemId-1].saved = true;
            Storage.saveProduct(productsData);
        }
        catch {} 
    };
});

const modal = $$modal(); // Введение модального окна