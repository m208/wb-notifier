document.addEventListener('DOMContentLoaded', async () => {
  await loadStats();

  document.querySelectorAll('.stats__button').forEach((el) => {
    const category = el.closest('.stats__item').dataset.category;
    el.addEventListener('click', () => loadDataForCategory(category));
  });
});

const apiLinks = [
  {
    category: 'orders',
    url: '/new-orders-tracker',
  },
  {
    category: 'feedbacks',
    url: '/new-feedbacks',
  },
  {
    category: 'questions',
    url: '/new-questions',
  },
  {
    category: 'returns',
    url: '/new-claims-tracker',
  },
  {
    category: 'chat',
    url: '/new-chats',
  },
];

async function loadDataForCategory(category) {
  if (!category) return;
  const el = document.querySelector(`div[data-category="${category}"]`);
  if (!el) return;

  el.querySelector('.stats__text').innerText = 'Проверяем...';

  const url = apiLinks.find((el) => el.category === category).url;
  if (url) {
    el.querySelector('.stats__text').innerText = await loadData(url);
  }
}

async function loadStats() {
  const stats = await Promise.all(
    apiLinks.map(async (item) => {
      const data = await loadData(item.url);
      return {
        category: item.category,
        data,
      };
    }),
  );

  stats.forEach((item) => {
    const el = document.querySelector(`div[data-category="${item.category}"]`);
    if (el) {
      el.querySelector('.stats__text').innerText = item.data;
    }
  });
}

async function loadData(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    return response.text();
  } catch (err) {
    console.error(err);
  }
}
