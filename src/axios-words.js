import axios from 'axios';

import { baseURL } from './shared/auth/private';

const instance = axios.create({
    baseURL: baseURL
});

export default instance;