import config from "@/config";
import axios from 'axios';

export default axios.create({
    baseURL: `${config.api_url}/auth/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});