const userId = localStorage.getItem("userId");
const summaryDiv = document.getElementById("order-summary");
const checkoutForm = document.getElementById("checkoutForm");
const messageDiv = document.getElementById("message");

let cartData = null;

async function loadSummary() {
  if (!userId) {
    summaryDiv.innerHTML = "<p>Bạn cần đăng nhập trước!</p>";
    checkoutForm.style.display = "none";
    return;
  }

  const res = await fetch(`/api/cart/${userId}`);
  const cart = await res.json();

  if (!cart || !cart.items || cart.items.length === 0) {
    summaryDiv.innerHTML = "<p>Không có sản phẩm trong giỏ hàng!</p>";
    checkoutForm.style.display = "none";
    return;
  }

  cartData = cart;

  let total = 0;
  let html = "<h3>Danh sách sản phẩm:</h3><ul>";

  cart.items.forEach(item => {
    const { product, quantity } = item;
    const price = product.price * quantity;
    total += price;
    html += `<li>${product.name} (${quantity}) - ${price.toLocaleString()} đ</li>`;
  });

  html += `</ul><strong>Tổng tiền: ${total.toLocaleString()} đ</strong>`;
  summaryDiv.innerHTML = html;
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!cartData) return;

  const totalPrice = cartData.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const order = {
    user: userId,
    products: cartData.items.map(i => ({
      product: i.product._id,
      quantity: i.quantity
    })),
    totalPrice
  };

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  });

  const result = await res.json();
  if (res.ok) {
    messageDiv.innerHTML = `<p style="color:green">${result.message}</p>`;
    summaryDiv.innerHTML = "";
    checkoutForm.reset();
  } else {
    messageDiv.innerHTML = `<p style="color:red">Lỗi: ${result.message}</p>`;
  }
});

loadSummary();
