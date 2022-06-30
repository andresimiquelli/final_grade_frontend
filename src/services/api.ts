import axios, { Axios } from "axios";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1'
})

function useApi(token: string = ""): Axios {
    if(token.length>0) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    return api
}

export { useApi }