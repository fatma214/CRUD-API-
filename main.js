let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productCategory = document.getElementById("productCategory");
let productDesc = document.getElementById("productDesc");
let stockQuantity = document.getElementById("stockQuantity");
let addBtn = document.getElementById("addBtn");
let updateBtn = document.getElementById("updateBtn");
let demo = document.getElementById("demo");

let productList = [];
async function getProducts() {
  let data = await fetch("http://localhost:3000/products");
  let res = await data.json();
  productList = res;
  console.log(productList);
  console.log(res);
  displayProducts(productList);
}

getProducts();

async function addProduct() {
   
  let user_id = JSON.parse(localStorage.getItem("lastId")) + 1;

  var product = {
    id: user_id.toString(),
    name: productName.value,
    price: productPrice.value,
    category: productCategory.value,
    description: productDesc.value,
    stock_Quantity: stockQuantity.value,
  };
  localStorage.setItem("lastId", product.id);
  let data = await fetch("http://localhost:3000/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
  getProducts();

  console.log(data);
  clear();
}

function displayProducts(list) {
  let productRows = ``;
  for (let i = 0; i < list.length; i++) {
    productRows += `<tr>
        <td>${list[i].id}</td>
        <td>${list[i].newName ? list[i].newName : list[i].name}</td>
        <td>${list[i].price}</td>
        <td>${list[i].category}</td>
        <td>${list[i].description?.split(" ").slice(0, 15).join(" ")}</td>
        <td>${list[i].stock_Quantity}</td>
        <td><button  onclick="getUpdatedProduct(${
          list[i].id
        })"  class="btn btn-warning btn-sm">Update</button></td>
        <td><button  onclick="deleteProduct(${
          list[i].id
        })" class="btn btn-danger btn-sm">Delete</button></td>
      </tr>`;
  }

  demo.innerHTML = productRows;
}

function clear() {
  productName.value = "";
  productPrice.value = "";
  productCategory.value = "";
  productDesc.value = "";
}

//------------- delete product ----------//
async function deleteProduct(id) {
  console.log(id);
  let data = await fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  });
getProducts();
  console.log(data);
}

//------------- search ---------------//
function searchByName(value) {
  let foundedProduct = [];
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(value.toLowerCase())) {
      let regex = new RegExp(value, "gi"); //Case-insensitive
      productList[i].newName = productList[i].name.replace(
        regex,
        (match) => `<span class="text-danger">${match}</span>`
      );
      foundedProduct.push(productList[i]);
    }
  }
  displayProducts(foundedProduct);
}

//------------- update --------------//
let updatedProd = {};
async function getUpdatedProduct(id) {
  let data = await fetch(`http://localhost:3000/products/${id}`);
  updatedProd = await data.json();
  console.log(updatedProd);
  productName.value = updatedProd.name;
  productPrice.value = updatedProd.price;
  productCategory.value = updatedProd.category;
  productDesc.value = updatedProd.description;
  stockQuantity.value = updatedProd.stock_Quantity;

  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}

async function update() {
  updateBtn.classList.add("d-none");
  addBtn.classList.remove("d-none");
  var product = {
    id: updatedProd.id,
    name: productName.value,
    price: productPrice.value,
    category: productCategory.value,
    description: productDesc.value,
    stock_Quantity: stockQuantity.value,
    image: updatedProd.image,
    rating: updatedProd.rating,
  };
  let data = await fetch(`http://localhost:3000/products/${product.id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
  console.log(data);
  getProducts();
 
  clear();

  
  console.log(productList);
}
