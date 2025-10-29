const messageEl = document.getElementById("message");

function toggleForm(type) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const formTitle = document.getElementById("formTitle");
  messageEl.textContent = "";

  if (type === "register") {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "Đăng ký";
  } else {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    formTitle.textContent = "Đăng nhập";
  }
}

// Đăng ký tài khoản mới
async function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!username || !email || !password) {
    messageEl.textContent = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    messageEl.style.color = "green";
    messageEl.textContent = "Đăng ký thành công! Vui lòng đăng nhập.";
    toggleForm('login');
  } catch (err) {
    messageEl.style.color = "red";
    messageEl.textContent = "Lỗi: " + err.message;
  }
}

// Đăng nhập
async function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    messageEl.textContent = "Vui lòng nhập tên đăng nhập và mật khẩu.";
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    // ✅ Lưu userId và isAdmin vào localStorage
    localStorage.setItem("userId", data.user._id);
    localStorage.setItem("isAdmin", data.user.isAdmin);
    localStorage.setItem("username", data.user.username);

    messageEl.style.color = "green";
    messageEl.textContent = "Đăng nhập thành công!";

    // Chuyển về trang chủ
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

  } catch (err) {
    messageEl.style.color = "red";
    messageEl.textContent = "Lỗi: " + err.message;
  }
}
