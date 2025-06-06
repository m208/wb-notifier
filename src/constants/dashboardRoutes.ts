export const dashBoardRouteValues = [
  {
    name: 'settings',
    link: '/app-settings',
    text: 'Настройки',
  },
  {
    name: 'tokens',
    link: '/access-tokens',
    text: 'API ключи',
  },
  {
    name: 'stats',
    link: '/stats',
    text: 'Статус',
  },
  {
    name: 'logs',
    link: '/logs',
    text: 'Логи',
  },
];

export const getDashboardLink = (name: string) => {
  return dashBoardRouteValues.find((el) => el.name === name).link || '';
};
