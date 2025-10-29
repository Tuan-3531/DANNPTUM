async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();

    // Nếu API trả về lỗi hoặc không phải mảng
    if (!Array.isArray(products)) {
      console.error("API /api/products không trả về mảng:", products);
      return;
    }

    const container = document.getElementById('product-list');
    container.innerHTML = products.map(p => `
      <div class="product">
        <img src="${p.image}" width="150">
        <h3>${p.name}</h3>
        <p>${Number(p.price).toLocaleString()}đ</p>
        <a href="product.html?id=${p._id}">Xem chi tiết</a><br>
        <button onclick="addToCart('${p._id}')">🛒 Thêm vào giỏ</button>
      </div>
    `).join('');
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
}

async function addToCart(productId) {
  const userId = localStorage.getItem("userId");

  // Nếu chưa đăng nhập
  if (!userId) {
    alert("⚠️ Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity: 1 })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert("✅ Đã thêm sản phẩm vào giỏ hàng!");
  } catch (err) {
    console.error("Lỗi khi thêm giỏ hàng:", err);
    alert("❌ " + err.message);
  }
}

// Gọi khi trang load
loadProducts();
