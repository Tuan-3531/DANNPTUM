const userId = localStorage.getItem("userId");
const ordersDiv = document.getElementById("orders-list");

async function loadOrders() {
  if (!userId) {
    ordersDiv.innerHTML = "<p>Bạn cần đăng nhập trước!</p>";
    return;
  }

  try {
    const res = await fetch(`/api/orders/${userId}`);
    const orders = await res.json();

    if (!orders || orders.length === 0) {
      ordersDiv.innerHTML = "<p>Chưa có đơn hàng nào.</p>";
      return;
    }

    let html = "";
    orders.forEach(order => {
      html += `<div class="order">
        <p>Đơn hàng #${order._id}</p>
        <p>Trạng thái: ${order.status}</p>
        <ul>`;
      order.items.forEach(item => {
        html += `<li>${item.product.name} (${item.quantity}) - ${item.product.price.toLocaleString()} đ</li>`;
      });
      html += `</ul>
        <p>Tổng: ${order.totalAmount.toLocaleString()} đ</p>`;
      
      if (order.status !== "Đã hủy") {
        html += `<button onclick="cancelOrder('${order._id}')">Hủy đơn</button>`;
      }

      html += `</div><hr>`;
    });

    ordersDiv.innerHTML = html;
  } catch (err) {
    console.error("Lỗi load đơn hàng:", err);
    ordersDiv.innerHTML = "<p>Lỗi khi tải đơn hàng.</p>";
  }
}

async function cancelOrder(orderId) {
  const confirmCancel = confirm("Bạn có chắc muốn hủy đơn hàng này?");
  if (!confirmCancel) return;

  try {
    const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      alert("Hủy đơn hàng thành công!");
      loadOrders();
    } else {
      alert("Lỗi: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi khi hủy đơn hàng.");
  }
}

loadOrders();
