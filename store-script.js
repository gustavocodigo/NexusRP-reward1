// projeto de teste de FrontEnd - Gustavo Wallace

// Neste usei o padrao de classe mas me adapto a qualquer que usaremos nos projetos.

class Store {
    // setar o titulo, descriçao e icone
    setStoreInfo(title, description, iconUrl) {
        if (title)
            document.getElementById("title").innerText = title
        if (description)
            document.getElementById("title-description").innerText = description
        if (iconUrl)
            document.getElementById("icon").src = iconUrl
    }


    // construtor ja começar na tab store
    constructor() {
        this.gotoTab("store")

        // lista de itens da loja
        this.itens = []

        // lista dos itens que estão no carrinho

        this.cartItems = []

        this.itensComponent = document.getElementById("itens-component").firstElementChild;


        this.totalPriceToPay = 0
        this.paymentMethod = "carteira"

        // configurar aquele botao de mudar entre as tabs store e carrinho
        let buttonToggleElement = document.getElementById("button1-toggle-navigation")
        buttonToggleElement.addEventListener("click", () => {
            this.toggleTab();
        })


        this.cardItemElement = document.getElementById("cart-product")
        this.cardItemElement.style.display = "none"
        this.purchaseCallback = null
        
        
        document.getElementById("finish-payment-button").addEventListener("click", () => {
            if (this.purchaseCallback != null) {
                this.purchaseCallback(this.cartItems, this.totalPriceToPay, this.paymentMethod)
            }
        })

        document.getElementById("payment-carteira").addEventListener("click", (event) => {
            this.paymentMethod = "carteira"
           
            let element = event.target
            document.getElementById("checked2").style.display = "none"
            document.getElementById("checked1").style.display = "block"
        })

        document.getElementById("payment-debito").addEventListener("click", (event) => {
            this.paymentMethod = "debito"
            let element = event.target
            document.getElementById("checked1").style.display = "none"
            document.getElementById("checked2").style.display = "block"
        })


        document.getElementById("input-search-container").addEventListener("keyup", (event) => {
            if (event.keyCode === 13 || event.key === "Enter") {
                event.target.blur()
                alert("Pesquisar: "+event.target.value)
              
            }
        })


    }



    removeFromCart(item) {
        for (let i = 0; i < this.cartItems.length; i++)
            if (this.cartItems[i].id == item.id) {
                this.cartItems.splice(i, 1)
                break;
            }
        this.updateTotalCartValues()
    }



    updateTotalCartValues() {
        let prices = 0;
        for (let i = 0; i < this.cartItems.length; i++) {
            this.cartItems[i].cartCount = this.cartItems[i].cartCountComponent.value
            prices += this.cartItems[i].price * this.cartItems[i].cartCount
        }
        this.totalPriceToPay = prices
        document.getElementById("total-price").innerText = this.formatValueToRealBrazilian(prices)

    }
    addToCart(item) {
        for (let i = 0; i < this.cartItems.length; i++)
            if (this.cartItems[i].id == item.id) return;
        item.cartCount = 1
        const originalElement = this.cardItemElement;
        const productsComponents = document.getElementById("products-component")
        // Clona o elemento e coloca as variaveis em seus respectivos lugares no DOM
        const clonedElement = originalElement.cloneNode(true);
        clonedElement.querySelector("#icon").src = item.iconUrl
        clonedElement.querySelector("#price2").innerText = this.formatValueToRealBrazilian(item.price)
        clonedElement.querySelector("#kg2").innerText = `${item.kg} KG`
        clonedElement.querySelector("#description").innerText = item.description
        clonedElement.querySelector("#description").title = item.description
        clonedElement.querySelector("#name").innerText = item.name
        clonedElement.querySelector("#arrow-left").addEventListener("click", () => {
            this.updateTotalCartValues();
        })
        clonedElement.querySelector("#arrow-right").addEventListener("click", () => {
            this.updateTotalCartValues();
        })
        item.cartCountComponent = clonedElement.querySelector("#max-item")
        item.cartCountComponent.addEventListener("keyup", (event) => {
            if (event.keyCode === 13 || event.key === "Enter") {
                // Perform the desired action when the Enter key is pressed
                event.target.value = Math.min(parseInt(event.target.value), 999)
                event.target.value = Math.max(event.target.value, 1)
                event.target.blur() // tirar o foco
            }
           
            if ( parseInt( event.target.value) <= 999 )
                this.updateTotalCartValues();
            
        })
        item.cartCountComponent.addEventListener("blur", (event) => {
           if ( event.target.value == "") event.target.value = 1
            event.target.value = Math.min(parseInt(event.target.value), 999)
            event.target.value = Math.max(event.target.value, 1)
            this.updateTotalCartValues();
        })


        clonedElement.style.display = "flex"

        clonedElement.querySelector("#remove-button").addEventListener("click", (element) => {
            clonedElement.remove()
            this.removeFromCart(item)
            item.cartCount = 0

        })
        productsComponents.appendChild(clonedElement)




        this.cartItems.push(item)
        this.updateTotalCartValues("ok")
    }

    // trocar de tab entre o carrinho e os itens
    toggleTab() {
        if (this.currentTab == "store")
            this.gotoTab("cart")
        else
            this.gotoTab("store")
    }

    // ir para uma tab especifica da loja
    gotoTab(index) {
        switch (index) {
            case "store":
                this.setStoreInfo("LOJINHA", "ITENS PARA VENDA", "./assets/shop.svg")
                document.getElementById("input-filter").style.display = "block"

                setTimeout(() => {
                    document.getElementById("input-filter").classList.remove("search-input-outanimation")
                    document.getElementById("search-input-icon").style.display = "block"
                })
                setTimeout(() => {
                    document.getElementById("button1-toggle-navigation").innerHTML = `<img draggable="false" src="./assets/shop-carr.svg"> MEU CARRINHO <img draggable="false" src="./assets/arrow-right.svg">`
                }, 0.1 * 1000)
                document.getElementById("cart-component").style.display = "none"
                document.getElementById("itens-component").style.display = "flex"
                break;
            case "cart":
                this.setStoreInfo("CARRINHO", "FINALIZE SUA COMPRA", "./assets/shop-car2.svg")
                document.getElementById("input-filter").classList.add("search-input-outanimation")
                document.getElementById("search-input-icon").style.display = "none"
                

                // remover o elemento visualmente depois de 200 ms
                setTimeout(() => {
                    document.getElementById("input-filter").style.display = ("none")
                    document.getElementById("button1-toggle-navigation").innerHTML = `<img draggable="false" src="./assets/arrow-left.svg"> CONTINUAR COMPRANDO`
                }, 0.2 * 1000)
                document.getElementById("cart-component").style.display = "flex"
                document.getElementById("itens-component").style.display = "none"
                break;
        }
        this.currentTab = index
    }


    // quando o elemento de add to cart de um produto é clicado este metodo é invocado
    onClickAddToCartButton(item) {
        if (this.lockedCartAnimation == true) return;
        let togleBtn = document.getElementById("button1-toggle-navigation")
        let oldbg = togleBtn.style.backgroundColor
        togleBtn.style.backgroundColor = "red"
        this.lockedCartAnimation = true
        setTimeout(() => {
            togleBtn.style.backgroundColor = oldbg
            this.lockedCartAnimation = false
        }, 200)
        this.addToCart(item)
    }

    // formatar qualquer varuavel em texto em reais corretamente. exemplo 1000 se torna R$ 1.000,00
    formatValueToRealBrazilian(valor) {
        if (isNaN(valor)) {
            return "Valor inválido";
        }

        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }


    // inserir um novo elemento na loja, esse normalmente sera chamado dps de consultar a api de itens la embaixo
    insertItem(item) {
        this.itens.push(item)
        // Seleciona o elemento que será clonado
        const originalElement = document.getElementById("item-card-template");
        // Clona o elemento e coloca as variaveis em seus respectivos lugares no DOM
        const clonedElement = originalElement.cloneNode(true);
        clonedElement.querySelector("#kg").innerText = `${item.kg} KG`
        clonedElement.querySelector("#item-name").innerText = item.name
        clonedElement.querySelector("#description").innerText = item.description
        clonedElement.querySelector("#icon").src = item.iconUrl
        clonedElement.querySelector("#price").innerText = this.formatValueToRealBrazilian(item.price)
        clonedElement.style.display = "flex"
        clonedElement.querySelector("#add-to-cart-button").addEventListener("click", (element) => {
            this.onClickAddToCartButton(item);

        })
        this.itensComponent.appendChild(clonedElement)
    }


    // vc chama esse passando uma função e ela é chamada devolta toda vez que o usuario clicar em comprar
    //parametro que vai ser colocado na callback é o id dos itens que estão no carrinho
    setPurchaseItensCallback(callback) {
        this.purchaseCallback = callback
    }
}






// quando o dom carregar chama essa função e instancia a loja e consulta a apis..
function domLoaded() {
    var imagens = document.querySelectorAll('img');
    for (var i = 0; i < imagens.length; i++) {
        imagens[i].setAttribute('draggable', 'false');
    }

    var imagens = document.querySelectorAll('img');
    for (var i = 0; i < imagens.length; i++) {
        imagens[i].addEventListener('mousedown', function (event) {
            if (event.button === 2) { // Verifica se o botão pressionado é o botão direito
                event.preventDefault();
            }
        });
    }




    const store = new Store()


    // vamos supor que a api retornou os seguintes dados
    const itens = [
        {
            id: 0,
            name: "Rádio",
            description: "Descrição do item muito bom",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (1).png",
            price: 2000
        },
        {
            id: 2,
            name: "Roupas",
            description: "Descrição do item muito bom",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (2).png",
            price: 200
        },
        {
            id: 3,
            name: "Aliança",
            description: "Dê o anel para seu marido.",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (3).png",
            price: 100
        },
        {
            id: 4,
            name: "Galão",
            description: "Galão para encher de gasolina.6",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (4).png",
            price: 50.23
        },
        {
            id: 5,
            name: "Kit de Reparo",
            description: "Reparar total o veículo",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (5).png",
            price: 20
        },
        {
            id: 6,
            name: "Militec",
            description: "Reparar apenas o motor do veículo.",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (6).png",
            price: 500
        },
        {
            id: 7,
            name: "Mochila",
            description: "Aumentará seu espaço no inventário.",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (7).png",
            price: 10.99
        },
        {
            id: 8,
            name: "Mochila",
            description: "Aumentará seu espaço no inventário.",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (7).png",
            price: 10.99
        },
        {
            id: 9,
            name: "Mochila",
            description: "Aumentará seu espaço no inventário.",
            kg: 0.6,
            iconUrl: "./assets/itens/Item (7).png",
            price: 10.99
        },
    ]


    // iteramos sobre cada elemento adicionando na loja
    for (let i = 0; i < itens.length; i++) {
        store.insertItem(itens[i])
    }


    // adicionamos um callback quando o usuario requisitar a compra
    store.setPurchaseItensCallback((itens, price, formaDePagamento) => {
        if ( itens.length == 0) {
            alert("O CARRINHO ESTÀ VAZIO")
            return
        }
        let name = ""
        for (let i = 0; i < itens.length; i++) {
            name = name + itens[i].cartCount + "x " + itens[i].name + " \n" 
        }
        alert("FORMA DE PAGAMENTO: "+formaDePagamento+" \nTOTAL: "+store.formatValueToRealBrazilian(price) +"\n\n"+ name + "\n")
    })
}