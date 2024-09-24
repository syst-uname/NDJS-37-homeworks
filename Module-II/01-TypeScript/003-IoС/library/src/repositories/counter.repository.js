import axios from 'axios'
import config from '../config/index.js';

class CounterRepository {

  async incr(bookId) {
    try {
      await axios.post(`${config.counter.url}/counter/${bookId}/incr`);
    } catch (error) {
      console.error(error);
      throw new Error(`counter error: ${error}`);
    }
  }

  async get(bookId) {
    try {
      const response = await axios.get(`${config.counter.url}/counter/${bookId}`);
      return response.data.count
    } catch (error) {
      console.error(error);
      throw new Error(`counter error: ${error}`);
    }
  }
}

export default CounterRepository