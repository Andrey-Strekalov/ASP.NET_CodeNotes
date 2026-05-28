import axios from 'axios';

const AUTH_URL = '/api/auth';

const authService = {
  async register(username, email, password, confirmPassword) {
    const response = await axios.post(`${AUTH_URL}/register`, {
      username,
      email,
      password,
      confirmPassword,
    });
    if (response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(username, password, rememberMe = false) {
    const response = await axios.post(`${AUTH_URL}/login`, {
      username,
      password,
      rememberMe,
    });
    if (response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return null;

    try {
      const response = await axios.post(`${AUTH_URL}/refresh`, {
        refreshToken: refresh,
      });
      if (response.data.accessToken) {
        localStorage.setItem('access_token', response.data.accessToken);
        localStorage.setItem('refresh_token', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch {
      authService.logout();
      return null;
    }
  },

  async logout() {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) {
        await axios.post(
          `${AUTH_URL}/logout`,
          { refreshToken: refresh },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
      }
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
