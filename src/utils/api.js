export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.188.242.2:8086';

export const publicFetch = async (path, options = {}) => {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  return res;
};

export const authFetch = async (path, options = {}, token) => {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      ...options.headers,
    },
  });
  if (res.status === 401) {
    const { logout } = require('../store/useStore').default.getState();
    logout();
    const NavigationService = require('../navigation/NavigationService').default;
    NavigationService.navigate('RoleSelect');
    throw new Error('Session expired. Please login again.');
  }
  return res;
};
