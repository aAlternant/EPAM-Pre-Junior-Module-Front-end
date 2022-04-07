function _createModal(){
    const modal = document.createElement("div");
    modal.classList.add("vmodal");
    modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay">
        <div class="modal-window">
            <div class="modal-header">
                <span class = "modal-title">Your Cart</span>
                <span class = "modal-close" onclick = "modal.close()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="item-box"></div>
                <div class = "cash-box">
                    <div class = "total">Total $</div>
                    <div class = "total" id = "summary"></div>
                    <div class = "modal-box" onclick = "modal.clean()">
                        <div class = "modal-text">Clear cart</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `);

    document.body.appendChild(modal);
    return modal
}
if (localStorage.getItem("Score") == (null || undefined)) {
    localStorage.setItem("Score", 0)
}
function _createItems(boolen) { // Создание товаров в корзине (!!!)
// boolen = фикс count: false = не трогает total, true = для создания с 0
    cartData = Storage.getCart()
    for (let items in cartData) {
        let itembox = document.querySelector(".item-box");
        let item = document.createElement("div");
        item.classList.add("modal__item");
        item.insertAdjacentHTML('afterbegin', `
        <img src = "${cartData[items][3]}" class = "modal__img" alt = "Ошибка загрузки фото">
        <div class = "modal__name">${cartData[items][0]}</div>
        <div class = "modal__price">${+(cartData[items][1].replace(/[^0-9]/g, ''))}$</div>
        <div class = "arrow-up" onclick = "countuse(${items}, true)">
            <img src = "img/arrow-up.png" id = "modal__arrow-up">
        </div>
        <div class = "arrow-down" onclick = "countuse(${items}, false)">
            <img src = "img/arrow-down.png" id ="modal__arrow-down">
        </div>
        <div class = "modal__count">${cartData[items][2]}</div>
        <div class = "modal__trashcan" onclick = "delete_item(${items})">
            <img src = "img/trash-can.png" class = "modal__trashcan-img" alt = "Удалить обьект">
        </div>
        `);
        itembox.appendChild(item);
        let price = +cartData[items][1].replace(/[^0-9]/g, '') * +cartData[items][2];
            boolen ? summary += +price : summary
    }
}
function delete_item(items) {
    let cartData = Storage.getCart();
    summary -= +(cartData[items][1].replace(/[^0-9]/g, '') * +cartData[items][2]);
    numscore--
    num.innerHTML = `${numscore}`
    delete cartData[items];
    Storage.saveCart(cartData);
    for (let btn of document.querySelectorAll(".disabled__btn")) {
        if (btn.getAttribute("data-id") == items) {
            btn.className = "box"
            btn.setAttribute("tabindex", 1);
            btn.firstElementChild.setAttribute("tabindex", 1);
            btn.firstElementChild.innerHTML = `Add to Cart`;
        }
    };
    productsData[items - 1].saved = false;
    Storage.saveProduct(productsData);
    localStorage.setItem("Score", numscore)
    modal.destroy();
    _createItems(false);
    document.querySelector("#summary").innerHTML = `${summary}`
}
function countuse(items, boolen) { // Функция работы с кол-вом. true + false - 
    let cartData = Storage.getCart();
    let price = +(cartData[items][1].replace(/[^0-9]/g, ''))
    let count = cartData[items][2];
    for (let modal of document.querySelectorAll(".modal__count")) {
        if (modal.parentElement.querySelector("img[class=modal__img]").getAttribute("src") == cartData[items][3]) {
            thismodal = modal
        }
    }
    if (boolen) {
        cartData[items][2]++;
        summary = summary + price
    } else {
        if (count <= 0) return;
        cartData[items][2]--;
        summary = summary - price
    }

    document.querySelector("#summary").innerHTML = `${summary}`
    thismodal.innerHTML = `${+cartData[items][2]}`
    Storage.saveCart(cartData)
}
//                                   Открытие/закрытие модального окна, доп.функции
$$modal = function(options) {
    const ANIMATION_SPEED = 200;
    const $modal = _createModal();
    let closing = false;
    return {
        open() {
            !closing && $modal.classList.add("open");
            _createItems(true);
            document.querySelector("#summary").innerHTML = `${summary}`
            document.body.style.overflow = "hidden";
        },
        close() { 
            closing = true;
            $modal.classList.remove("open");
            $modal.classList.add("hide");
            setTimeout( () => {
                $modal.classList.remove("hide");
                closing = false;
            }, ANIMATION_SPEED);
            document.body.style.overflow = "";
            this.destroy();
        },
        destroy() { // Удаление элементов корзины из DOM
            let itembox = document.querySelector(".item-box");
            for (let i = 0; i < 10; i++) {
                itembox.childNodes.forEach (child => {
                    if (child.className == "modal__item") {
                    child.parentNode.removeChild(child);
                    }
                });
            }
        },
        clean() { // Полная очистка корзины
            this.destroy();
            localStorage.clear();
            productsData = [];
            items.forEach(element => {
                productsData.push({ id : element.id, img: element.img, name: element.name, price: element.price, saved: false})
                Storage.saveProduct(productsData);
            });
            numscore = 0;
            num.innerHTML = `${numscore}`;
            summary = 0;
            document.querySelector("#summary").innerHTML = `${summary}`;
            for (let btn of document.querySelectorAll(".disabled__btn")) {
                btn.className = "box";
                btn.setAttribute("tabindex", 1);
                btn.firstElementChild.setAttribute("tabindex", 1);
                btn.firstElementChild.innerHTML = `Add to Cart`;
            };
        }
    }
}