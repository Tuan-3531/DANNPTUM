const userId = localStorage.getItem("userId");
const summaryDiv = document.getElementById("order-summary");
const checkoutForm = document.getElementById("checkoutForm");
const messageDiv = document.getElementById("message");
const token = localStorage.getItem('token');

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

  if (!cartData || cartData.items.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  const totalAmount = cartData.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const orderData = {
    userId,
    items: cartData.items.map(i => ({
      product: i.product._id,
      quantity: i.quantity
    })),
    totalAmount
  };

  console.log("Sending order:", orderData);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Đặt hàng thành công!");
      window.location.href = "orders.html";
    } else {
      alert("Lỗi: " + data.message);
    }
  } catch (err) {
    console.error("Lỗi gửi order:", err);
    alert("Lỗi server khi đặt hàng!");
  }
});

loadSummary();
