const API_URL = 'https://mgrinko.github.io/js-20180830';
// const API_URL = 'http://localhost:3000'

const HttpService = {
  sendRequest(url) {
    return fetch(`${API_URL}/api/${url}`)
      .then(response => response.json());
  }
};

export default HttpService;
