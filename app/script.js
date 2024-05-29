let cart = {}; // para almacenar los productos en el carrito

window.addEventListener("DOMContentLoaded", function () {
  fetchProductos();
  const allItems = document.getElementById("all");
  const coatItems = document.getElementById("coat");
  const feetItems = document.getElementById("feet");
  const trousersItems = document.getElementById("trousers");
  const cartContent = document.getElementById("cart-content");
  const cartShopp = document.getElementById("cart-shopp");
  const clearBtn = document.getElementById("clear-btn");
  const buyBtn = document.getElementById("buy-btn");

  allItems.addEventListener("click", () => {
    fetchProductos();
  });

  coatItems.addEventListener("click", () => {
    fetchProductos("coat");
  });

  feetItems.addEventListener("click", () => {
    fetchProductos("feet");
  });

  trousersItems.addEventListener("click", () => {
    fetchProductos("trousers");
  });

  async function fetchProductos(category = "") {
    const mySection = document.getElementById("contenedor");
    try {
      const res = await fetch("./data.json");
      const data = await res.json();

      // Limpiar el contenido del contenedor antes de agregar nuevos productos
      mySection.innerHTML = "";

      data.forEach((x) => {
        // Verificar si se debe filtrar por categoría
        if (category === "" || x.category === category) {
          const section = document.createElement("section");
          section.innerHTML = `
          <div class="backdrop-blur-xl rounded-xl div-conteiner text-center text-white p-2">
            <img src="${x.imageUrl}" alt="${x.name}">
            <div class="flex justify-around">
              <h2>${x.name}</h2>
              <h3 class="text-red-600">$ ${x.price}</h3>
            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quidem maxime totam atque omnis saepe.</p>
            <button class="border-2 text-red-600 hover:text-white hover:bg-red-700 p-2 button-buy" data-id="${x.id}">Add to cart</button>
          </div>
        `;
          mySection.append(section);

          // Agregar evento clic a cada botón "Add to cart"
          const btnBuys = section.querySelectorAll(".button-buy");
          btnBuys.forEach((btnBuy) => {
            btnBuy.addEventListener("click", (event) => {
              const productId = event.target.getAttribute("data-id");
              const productToAdd = data.find(
                (product) => product.id === parseInt(productId)
              );
              addToCart(productToAdd);
            });
          });
        }
      });
    } catch (error) {
      console.log("!ERROR¡");
    }
  }

  cartShopp.addEventListener("click", () => {
    const cart = document.getElementById("cart");
    cart.classList.toggle("hidden");
  });

  function addToCart(product) {
    if (cart[product.id]) {
      // Si el producto ya está en el carrito, aumenta la cantidad y el precio total
      cart[product.id].cantidad++;
      cart[product.id].priceTotal += product.price;
    } else {
      // Si el producto no está en el carrito, agrégalo con cantidad 1 y precio total igual al precio del producto
      cart[product.id] = {
        ...product,
        cantidad: 1,
        priceTotal: product.price,
      };
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
  clearBtn.addEventListener("click", () => {
    // Limpiar el carrito y actualizar el localStorage
    cart = {};
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });
  buyBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  });

  function renderCart() {
    cartContent.innerHTML = "";
    // Renderizar los productos en el carrito
    Object.values(cart).forEach((item) => {
      const div = document.createElement("div");
      div.classList.add(
        "flex",
        "bg-black",
        "p-1",
        "rounded-xl",
        "justify-center"
      );
      div.innerHTML = `
      <img src="${item.imageUrl}" class="rounded-full w-8">
      <h1 class="text-white">${item.name}</h1>
      <h2 class="text-red-600">$${item.priceTotal} (${item.cantidad})</h2>
      `;
      cartContent.appendChild(div);
    });
  }
});
