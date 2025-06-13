document.addEventListener('DOMContentLoaded', () => {
  initTokenForm({
    service: 'tg',
    validateUrl: '/tg/is-valid',
    formId: 'tg-bot-token-form',
    infoId: 'tg-token-info',
    resultId: 'tg-token-update-result',
    saveField: 'tg-token',
    showValidation: showTgValidationResult,
  });

  initTokenForm({
    service: 'wb',
    validateUrl: '/token',
    formId: 'wb-token-form',
    infoId: 'wb_token_info__valid',
    resultId: 'wb-token-update-result',
    saveField: 'wb-token',
    showValidation: showWbValidationResult,
  });

  initChatForm();
});

function initTokenForm({
  validateUrl,
  formId,
  infoId,
  resultId,
  saveField,
  showValidation,
}) {
  validateToken(validateUrl).then((result) => showValidation(result, infoId));

  document.getElementById(formId).addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = new FormData(e.target).get('token')?.trim();
    if (!token) return;

    const validation = await validateToken(validateUrl, token);
    showValidation(validation, infoId);

    if (!validation || !validation.isValid) {
      updateStatus(false, resultId);
      return;
    }

    const success = await saveToken(saveField, token);
    updateStatus(success, resultId);
  });
}

async function validateToken(url, token = null) {
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
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json();

    if (url.includes('/token')) {
      // WB
      const expired = new Date() > new Date(result.expires);
      const hasAll = !Object.values(result).some((el) => !el);
      return { ...result, isValid: !expired && hasAll };
    }

    return { ...result, isValid: result?.isValid };
  } catch (err) {
    console.error('Ошибка проверки токена:', err.message);
    return null;
  }
}

async function saveToken(field, value) {
  try {
    const response = await fetch('/settings/access', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error(await response.text());
    return true;
  } catch (err) {
    console.error('Ошибка при сохранении:', err.message);
    return false;
  }
}

function updateStatus(success, elId) {
  const el = document.getElementById(elId);
  el.innerText = success ? '✔️ Обновлено' : '❌ НЕ ОБНОВЛЕНО!';
}

function showTgValidationResult(result, elId) {
  const el = document.getElementById(elId);
  if (!result || !result.isValid) {
    el.innerText = '❌ Токен не валидный';
  } else {
    el.innerText = `✔️ Токен валидный. Username бота: ${result.username}`;
  }
}

function showWbValidationResult(result, elId) {
  const el = document.getElementById(elId);
  if (!result) {
    el.innerText = '❌ Токен не валидный';
  } else if (new Date() > new Date(result.expires)) {
    el.innerText = `❌ Токен просрочен ${new Date(result.expires).toLocaleDateString('ru-RU')}`;
  } else {
    el.innerText = `✔️ Токен валидный. Действует до: ${new Date(result.expires).toLocaleDateString('ru-RU')}`;
  }

  document.querySelectorAll('.token_info__chips .chips').forEach((chip) => {
    const category = chip.dataset.category;
    const isOk = !!result[category];
    chip.classList.toggle('chips_ok', isOk);
    chip.classList.toggle('chips_fail', !isOk);
  });
}

function initChatForm() {
  const form = document.getElementById('tg-chat-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const chat = new FormData(e.target).get('chat')?.trim();
    if (!chat) return;

    const success = await saveToken('tg-chat-id', chat);
    updateStatus(success, 'tg-chat-update-result');
  });
}
