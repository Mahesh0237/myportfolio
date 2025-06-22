import config from "@/config";
import axios from 'axios';

export default axios.create({
    baseURL: `${config.api_url}/team/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});