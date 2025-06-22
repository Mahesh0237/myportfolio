import config from "@/config";
import axios from 'axios';

export default axios.create({
    baseURL: `${config.api_url}/enquiry/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});