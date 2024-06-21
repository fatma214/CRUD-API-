let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productCategory = document.getElementById("productCategory");
let productDesc = document.getElementById("productDesc");
let stockQuantity = document.getElementById("stockQuantity");
let addBtn = document.getElementById("addBtn");
let updateBtn = document.getElementById("updateBtn");
let demo = document.getElementById("demo");
let wrongName = document.getElementById("wrongName");
let wrongPrice = document.getElementById("wrongPrice");
let wrongCateg = document.getElementById("wrongCateg");
let wrongDesc = document.getElementById("wrongDesc");
let wrongQuantity = document.getElementById("wrongQuantity");
let selectBoxCategory = document.getElementById("selectBoxCategory");
let selectedCategory = document.getElementById("selectedCategory");
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
  if (validation()) {
    var product = {
      id: user_id.toString(),
      name: productName.value,
      price: productPrice.value,
      category: selectBoxCategory.value,
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
  stockQuantity.value = "";
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
  selectedCategory.innerText = updatedProd.category;
  productDesc.value = updatedProd.description;
  stockQuantity.value = updatedProd.stock_Quantity;

  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}

async function update() {
  if (validation()) {
    updateBtn.classList.add("d-none");
    addBtn.classList.remove("d-none");
    var product = {
      id: updatedProd.id,
      name: productName.value,
      price: productPrice.value,
      category: selectedCategory.innerText,
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
}

//------------ validation ----------//

//---validate name
function validateName(value) {
  var regex = /^[A-Z][a-zA-Z]{2,20}( [A-Za-z-0-9']{1,20}){0,10}$/;

  if (value.length === 0) {
    wrongName.classList.remove("d-none");
    wrongName.innerHTML = "required";
    return false;
  }

  if (regex.test(value)) {
    wrongName.classList.add("d-none");
    return true;
  } else {
    wrongName.innerHTML =
      "Invalid name , name must start with capital [3-15] characters";
    wrongName.classList.remove("d-none");
    return false;
  }
}

//--- validate price

function validatePrice(value) {
  var regex = /^\d+(\.\d{1,2})?$/;
  if (value.length === 0) {
    wrongPrice.classList.remove("d-none");
    wrongPrice.innerHTML = "required";
    return false;
  }

  if (regex.test(value)) {
    wrongPrice.classList.add("d-none");
    return true;
  } else {
    wrongPrice.innerHTML =
      "Invalid price [Decimal Number with Two Decimal Places]";
    wrongPrice.classList.remove("d-none");
    return false;
  }
}

//--- validate category

function validateCategory() {
  let regex = /^[a-zA-Z ']{3,20}$/;

  if (regex.test(productCategory.value)) {
    errorMsgCategory.classList.add("d-none");
    return true;
  } else {
    errorMsgCategory.classList.remove("d-none");
    errorMsgCategory.innerHTML = "only Charcters [3-20]charcater";
    return false;
  }
}
//---validate SelectCategory
function validateSelectCategory() {
  const selectedCategoryText = selectedCategory.innerText.trim();
  if (selectedCategoryText === "-- Select Category --") {
    document.getElementById("wrongCateg").classList.remove("d-none");
    document.getElementById("wrongCateg").innerText =
      "Please select a category";
    return false;
  }
  document.getElementById("wrongCateg").classList.add("d-none");
  return true;
}
//--- validate Description

function validateDes(value) {
  if (value.length === 0) {
    wrongDesc.classList.remove("d-none");
    wrongDesc.innerHTML = "required";
    return false;
  } else {
    wrongDesc.classList.add("d-none");
    return true;
  }
}

//--- validate Stock Quantity

function validateQuantity(value) {
  if (value.length === 0) {
    wrongQuantity.classList.remove("d-none");
    wrongQuantity.innerHTML = "required";
    return false;
  } else {
    wrongQuantity.classList.add("d-none");
    return true;
  }
}

//--- validate all inputs

function validation() {
  let validName = validateName(productName.value);
  let validatPrice = validatePrice(productPrice.value);
  let validCateg = validateSelectCategory();
  let validDes = validateDes(productDesc.value);
  let validQuantity = validateQuantity(stockQuantity.value);

  return (
    validName &&
    validatPrice &&
    validCateg &&
    validatPrice &&
    validDes &&
    validQuantity
  );
}

//--- display categories
let arrOfCategories = [];

async function getCategories() {
  let data = await fetch("http://localhost:3000/categories");
  let res = await data.json();
  arrOfCategories = res;
  console.log(arrOfCategories);
  console.log(res);
  displayCategories(arrOfCategories);
}

getCategories();
function displayCategories(arr) {
  let options = ``;
  for (let i = 0; i < arr.length; i++) {
    options += `<li class="dropdown-option d-flex justify-content-between">
       ${arr[i].name} 
      <div onclick="stop(event)">
        <i class="fa-solid fa-pen-to-square" onclick="getUpdatedCateg('${arr[i].id}',event)"></i>
        <i class="fa-regular fa-trash-can" onclick="deleteCategory('${arr[i].id}',event)"></i>
      </div>
    
    </li>`;
  }
  selectBoxCategory.innerHTML = options;
}
function stop(e) {
  e.stopPropagation();
}
async function addCategory() {
  if (validateCategory()) {
    let categ_id = JSON.parse(localStorage.getItem("lastCategoryID")) + 1;

    var category = {
      id: categ_id.toString(),
      name: productCategory.value,
    };
    localStorage.setItem("lastCategoryID", category.id);
    let data = await fetch("http://localhost:3000/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
    getCategories();

    clear();
  }
}

function select(e) {
  document.getElementById("wrongCateg").classList.add("d-none");
  console.log(e.target);
  let selectedOption = e.target.textContent;
  selectedCategory.innerHTML = selectedOption;
}

let updatedCategory = {};
async function getUpdatedCateg(id) {
  let data = await fetch(`http://localhost:3000/categories/${id}`);
  updatedCategory = await data.json();
  console.log(updatedCategory);

  updateCategBtn.classList.remove("d-none");
  addCategBtn.classList.add("d-none");
  productCategory.value = updatedCategory.name;
}
async function updateCategory(e) {
  e.stopPropagation();
  updateCategBtn.classList.add("d-none");
  addCategBtn.classList.remove("d-none");
  var category = {
    id: updatedCategory.id,
    name: productCategory.value,
  };
  let data = await fetch(`http://localhost:3000/categories/${category.id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
   
  getCategories();

  productCategory.value=""
}
async function deleteCategory(id, event) {
  event.stopPropagation();
  console.log(id);
  let data = await fetch(`http://localhost:3000/categories/${id}`, {
    method: "DELETE",
  });
  getCategories();
}
