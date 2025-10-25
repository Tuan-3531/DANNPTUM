async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();

  const container = document.getElementById('product-list');
  container.innerHTML = products.map(p => `
    <div class="product">
      <img src="${p.image}" width="150">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()}đ</p>
      <a href="product.html?id=${p.id}">Xem chi tiết</a>
    </div>
  `).join('');
}

loadProducts();
