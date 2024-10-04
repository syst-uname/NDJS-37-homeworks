import axios from 'axios'
import config from '../config'
import { CounterDto } from './counter.dto'

export class CounterService {

    async incr(bookId: number) {
        try {
            await axios.post(`${config.counter.url}/counter/${bookId}/incr`)
        } catch (error) {
            console.error(error)
            throw new Error(`counter error: ${error.message}`)
        }
    }

    async get(bookId: number): Promise<number> {
        try {
            const response = await axios.get<CounterDto>(`${config.counter.url}/counter/${bookId}`)
            return response.data.count
        } catch (error) {
            console.error(error)
            throw new Error(`counter error: ${error.message}`)
        }
    }
}