document.addEventListener('DOMContentLoaded', () => {
  console.log('JS attached');
});

document
  .getElementById('login-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    const response = await fetch('/auth/login', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      window.location.href = '/settings';
    } else {
      const text = await response.text();

      const errorMessage = document.getElementById('error-message');
      errorMessage.textContent = text || 'Неверный логин или пароль';
    }
  });
