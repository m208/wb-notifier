//     Event Handlers

document.addEventListener('DOMContentLoaded', loadServerSettingsForTg);

document
  .getElementById('tg-chat-form')
  .addEventListener('submit', onTgChatFormSubmit);

document
  .getElementById('tg-bot-token-form')
  .addEventListener('submit', onTgTokenFormSubmit);

async function loadServerSettingsForTg() {
  const validationResult = await validateTgToken();
  showTokenValidationResult(validationResult);
}

async function onTgChatFormSubmit(event) {
  event.preventDefault();
  const chatId = new FormData(event.target).get('chat')?.trim();

  if (!chatId) {
    return;
  }

  const success = await saveTgChatToServer(chatId);
  showChatUpdateStatus(success);
}

async function onTgTokenFormSubmit(event) {
  event.preventDefault();
  const token = new FormData(event.target).get('token')?.trim();

  if (!token) return;

  const validationResult = await validateTgToken({ token });
  showTokenValidationResult(validationResult);

  if (!validationResult || !validationResult.isValid) {
    showTokenUpdateStatus(false);
    return;
  }

  const success = await saveTgTokenToServer(token);
  showTokenUpdateStatus(success);
}

//        API

async function validateTgToken({ token } = {}) {
  const options = {
    method: token ? 'POST' : 'GET',
    credentials: 'include',
  };

  if (token) {
    const formData = new URLSearchParams();
    formData.append('token', token);
    options.body = formData;
  }

  try {
    const response = await fetch('/tg/is-valid', options);
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (err) {
    console.error('Ошибка проверки токена:', err.message);
    return null;
  }
}

async function saveTgTokenToServer(token) {
  try {
    const response = await fetch('/settings/access', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'tg-token', value: token }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error(await response.text());
    return true;
  } catch (err) {
    console.error('Ошибка при сохранении токена:', err.message);
    return false;
  }
}

async function saveTgChatToServer(chat) {
  try {
    const response = await fetch('/settings/access', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'tg-chat-id', value: chat }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error(await response.text());
    return true;
  } catch (err) {
    console.error('Ошибка при сохранении:', err.message);
    return false;
  }
}

//        UI Logic

function showTokenValidationResult(result) {
  const el = document.getElementById('tg-token-info');
  if (!result || !result.isValid) {
    el.innerText = '❌ Токен не валидный';
  } else {
    el.innerText = `✔️ Токен валидный. Username бота: ${result.username}`;
  }
}

function showTokenUpdateStatus(success) {
  const el = document.getElementById('tg-token-update-result');
  el.innerText = success ? '✔️ Обновлено' : '❌ НЕ ОБНОВЛЕНО!';
}

function showChatUpdateStatus(success) {
  const el = document.getElementById('tg-chat-update-result');
  el.innerText = success ? '✔️ Обновлено' : '❌ НЕ ОБНОВЛЕНО!';
}
