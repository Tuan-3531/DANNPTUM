const token = localStorage.getItem('token');
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
        <td>
        <button onclick="removeFromCart('${product._id}')">❌ Xóa</button>
      </td>
      </tr>`;
  });

  html += "</table>";
  cartContainer.innerHTML = html;
  totalEl.textContent = `Tổng cộng: ${total.toLocaleString()} đ`;
}
async function removeFromCart(productId) {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const res = await fetch(`/api/cart/${userId}/${productId}`, {
    method: 'DELETE'
  });

  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    loadCart(); // tải lại giỏ hàng sau khi xóa
  } else {
    alert('Lỗi: ' + data.message);
  }
}
async function placeOrder() {
  const userId = localStorage.getItem("userId");
  const res = await fetch("/api/cart/" + userId);
  const cart = await res.json();

  const orderData = {
    user: userId,
    items: cart.items.map(i => ({
      product: i.product._id,
      quantity: i.quantity
    })),
    totalAmount: cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  };

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const err = await response.json();
    alert("Lỗi đặt hàng: " + err.message);
    return;
  }

  alert("Đặt hàng thành công!");
  localStorage.removeItem("cart");
  window.location.href = "orders.html";
}
checkoutBtn.addEventListener("click", () => {
  window.location.href = "checkout.html";
});

loadCart();
