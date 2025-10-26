const apiUrl = '/api/products';
const form = document.getElementById('product-form');
const cancelEditBtn = document.getElementById('cancel-edit');
const tbody = document.querySelector('#product-table tbody');

// 🧩 Load danh sách sản phẩm
async function loadProducts() {
  const res = await fetch(apiUrl);
  const products = await res.json();

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.price.toLocaleString()}đ</td>
      <td><img src="${p.image}" width="80"></td>
      <td>${p.description || ''}</td>
      <td>
        <button onclick="editProduct('${p._id}')">✏️ Sửa</button>
        <button onclick="deleteProduct('${p._id}')">🗑️ Xóa</button>
      </td>
    </tr>
  `).join('');
}

// ➕ Thêm hoặc cập nhật sản phẩm
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('product-id').value;
  const product = {
    name: document.getElementById('name').value,
    price: Number(document.getElementById('price').value),
    image: document.getElementById('image').value,
    description: document.getElementById('description').value
  };

  if (id) {
    // Sửa sản phẩm
    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
  } else {
    // Thêm sản phẩm
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
  }

  form.reset();
  document.getElementById('product-id').value = '';
  cancelEditBtn.style.display = 'none';
  loadProducts();
});

// 📝 Sửa sản phẩm
async function editProduct(id) {
  const res = await fetch(`${apiUrl}/${id}`);
  const p = await res.json();

  document.getElementById('product-id').value = p._id;
  document.getElementById('name').value = p.name;
  document.getElementById('price').value = p.price;
  document.getElementById('image').value = p.image;
  document.getElementById('description').value = p.description;
  cancelEditBtn.style.display = 'inline-block';
}

// ❌ Hủy sửa
cancelEditBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('product-id').value = '';
  cancelEditBtn.style.display = 'none';
});

// 🗑️ Xóa sản phẩm
async function deleteProduct(id) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadProducts();
  }
}

// Tải danh sách khi mở trang
loadProducts();
