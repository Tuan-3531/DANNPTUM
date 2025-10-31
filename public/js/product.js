const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const userId = localStorage.getItem("userId");
const productList = document.getElementById("product-list");

async function loadProductDetail() {
  if (!id) {
    document.getElementById('product-detail').innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
    return;
  }

  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();

  if (!product || product.message) {
    document.getElementById('product-detail').innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
    return;
  }

  document.getElementById('product-detail').innerHTML = `
    <img src="${product.image}" width="250" alt="${product.name}">
    <h2>${product.name}</h2>
    <p><strong>Giá:</strong> ${product.price.toLocaleString()}đ</p>
    <p>${product.description}</p>
    <button id="addToCart">Thêm vào giỏ hàng</button>
  `;

  document.getElementById('addToCart').addEventListener('click', () => addToCart(product));
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(item => item._id === product._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Đã thêm sản phẩm vào giỏ hàng!');
}

loadProductDetail();
