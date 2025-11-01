

const userId = localStorage.getItem("userId");
const token = localStorage.getItem('token');
const isAdmin = localStorage.getItem("isAdmin");
const adminBtn = document.getElementById("admin-btn");
async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/verify", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Token hết hạn hoặc không hợp lệ");

    const data = await res.json();
    console.log("Token hợp lệ cho:", data.user.username);

  } catch (err) {
    console.warn("Đăng nhập hết hạn:", err.message);
    localStorage.clear();
    window.location.href = "login.html";
  }
};

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();

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
        <button onclick="addToCart('${p._id}')">Thêm vào giỏ</button>
      </div>
    `).join('');
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
}

async function addToCart(productId) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
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
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  } catch (err) {
    console.error("Lỗi khi thêm giỏ hàng:", err);
    alert("Lỗi:" + err.message);
  }
}
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("isAdmin");

  window.location.href = "login.html";
});
loadProducts();
