let serverSideTrackingSettings = {};

document.addEventListener('DOMContentLoaded', async () => {
  displayAppSettings();
});

document
  .getElementById('tracking-form')
  .addEventListener('submit', updateAppSettings);

document
  .getElementById('tracking-form')
  .addEventListener('change', trackCheckboxChanges);

async function displayAppSettings() {
  const settings = await loadAppSettings();

  if (settings) {
    serverSideTrackingSettings = settings;

    for (const [key, value] of Object.entries(settings)) {
      const cb = document.getElementById(key);
      if (cb) cb.checked = value;
    }
  }
}

async function loadAppSettings() {
  const response = await fetch('/settings', {
    method: 'GET',
    credentials: 'include',
  });

  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
}

async function updateAppSettings(event) {
  event.preventDefault();

  const form = event.target;
  const payload = collectFormSettings(form);

  try {
    const response = await fetch('/settings', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }

    serverSideTrackingSettings = payload;
    setSubmitButtonState(true, 'Настройки обновлены');
  } catch (error) {
    console.error(error);
    alert('Ошибка при обновлении настроек');
  }
}

function setSubmitButtonState(isDisabled, text) {
  const button = document.getElementById('tracking-submit');
  button.disabled = isDisabled;
  button.innerText = text;
}

function trackCheckboxChanges(event) {
  const target = event.target;

  if (target.type === 'checkbox') {
    const form = document.getElementById('tracking-form');
    const payload = collectFormSettings(form);

    const isChanged = Object.entries(payload).some(
      ([key, value]) => serverSideTrackingSettings[key] !== value,
    );

    setSubmitButtonState(!isChanged, 'Обновить');
  }
}

function collectFormSettings(form) {
  const payload = {};
  for (const element of form.elements) {
    if (element.type === 'checkbox' && element.name) {
      payload[element.name] = element.checked;
    }
  }
  return payload;
}
