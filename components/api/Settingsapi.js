import config from '@/config';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
export default axios.create({
    baseURL: `${config.api_url}/settings/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});