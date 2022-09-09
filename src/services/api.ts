import axios, { Axios } from "axios";

export const baseUrl = 'http://127.0.0.1:8000/api/v1'

const api = axios.create({
    baseURL: baseUrl
})

function useApi(token: string = ""): Axios {
    if(token.length>0) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    return api
}

export { useApi }