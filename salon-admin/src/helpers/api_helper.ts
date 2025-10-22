import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import config from '../config';

const { api } = config;

// Default axios setup
axios.defaults.baseURL = api.API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

/**
 * Retrieves the current token from session storage dynamically.
 */
const getToken = (): string | null => {
  const authUser = localStorage.getItem('authUser');
  return authUser ? JSON.parse(authUser).token : null;
};

// Request Interceptor: Attach token to headers dynamically
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors
axios.interceptors.response.use(
  (response) => (response.data ? response.data : response),
  (error) => {
    let message;
    switch (error.response?.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = 'Invalid credentials';
        break;
      case 404:
        message = 'Sorry! The data you are looking for could not be found';
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);

/**
 * Sets the default authorization header for Axios.
 * @param {string} token - The authentication token.
 */
const setAuthorization = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

class APIClient {
  /**
   * Fetches data from the given URL
   */
  get = (url: string, params?: any): Promise<AxiosResponse> => {
    const queryString = params
      ? Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : '';
    return axios.get(queryString ? `${url}?${queryString}` : url);
  };

  /**
   * Posts the given data to the URL
   */
  create = (url: string, data: any): Promise<AxiosResponse> => {
    return axios.post(url, data);
  };

  /**
   * Updates data
   */
  update = (url: string, data: any): Promise<AxiosResponse> => {
    return axios.patch(url, data);
  };

  put = (url: string, data: any): Promise<AxiosResponse> => {
    return axios.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {
  const user = localStorage.getItem('authUser');
  return user ? JSON.parse(user) : null;
};

export { APIClient, setAuthorization, getLoggedinUser };
