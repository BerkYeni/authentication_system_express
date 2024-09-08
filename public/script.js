// Helper function for making API calls
async function apiCall(url, method, data) {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

// Register form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const result = await apiCall('/api/auth/register', 'POST', { username, password });
      document.getElementById('message').textContent = result.message;
    } catch (error) {
      document.getElementById('message').textContent = 'Registration failed';
    }
  });
}

// Login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const result = await apiCall('/api/auth/login', 'POST', { username, password });
      if (result.token) {
        localStorage.setItem('token', result.token);
        window.location.href = 'dashboard.html';
      } else {
        document.getElementById('message').textContent = 'Login failed';
      }
    } catch (error) {
      document.getElementById('message').textContent = 'Login failed';
    }
  });
}

// Dashboard functionality
const dashboardUsername = document.getElementById('username');
const logoutBtn = document.getElementById('logoutBtn');

if (dashboardUsername && logoutBtn) {
  // Fetch user data
  async function fetchUserData() {
    try {
      const result = await apiCall('/api/protected', 'GET');
      dashboardUsername.textContent = result.user.username;
    } catch (error) {
      window.location.href = 'login.html';
    }
  }

  fetchUserData();

  // Logout functionality
  logoutBtn.addEventListener('click', async () => {
    try {
      await apiCall('/api/auth/logout', 'POST');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Logout failed', error);
    }
  });
}