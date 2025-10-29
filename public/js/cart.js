
const userId = localStorage.getItem("userId"); // ID người dùng đăng nhập
const cartContainer = document.getElementById("cart-container");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
async function loadCart() {
  
  if (!userId) {
    cartContainer.innerHTML = "<p>Bạn cần đăng nhập trước!</p>";
    checkoutBtn.style.display = "none";
    return;
  }
  
  
  const res = await fetch(`/api/cart/${userId}`);
  const cart = await res.json();

  if (!cart || !cart.items || cart.items.length === 0) {
    cartContainer.innerHTML = "<p>Giỏ hàng trống.</p>";
    totalEl.textContent = "";
    checkoutBtn.style.display = "none";
    return;
  }

  let html = "<table><tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Thành tiền</th></tr>";
  let total = 0;

  cart.items.forEach(item => {
    const { product, quantity } = item;
    const price = product.price * quantity;
    total += price;

    html += `
      <tr>
        <td>${product.name}</td>
        <td>${quantity}</td>
        <td>${product.price.toLocaleString()} đ</td>
        <td>${price.toLocaleString()} đ</td>
      </tr>`;
  });

  html += "</table>";
  cartContainer.innerHTML = html;
  totalEl.textContent = `Tổng cộng: ${total.toLocaleString()} đ`;
}

checkoutBtn.addEventListener("click", () => {
  window.location.href = "checkout.html";
});

loadCart();
