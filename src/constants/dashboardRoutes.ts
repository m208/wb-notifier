export const dashBoardRouteValues = [
  {
    name: 'settings',
    link: '/app-settings',
    label: 'Настройки',
  },
  {
    name: 'tokens',
    link: '/access-tokens',
    label: 'API ключи',
  },
  {
    name: 'stats',
    link: '/stats',
    label: 'Статус',
  },
  {
    name: 'logs',
    link: '/logs',
    label: 'Логи',
  },
];

export const getDashboardLink = (name: string) => {
  return dashBoardRouteValues.find((el) => el.name === name).link || '';
};
