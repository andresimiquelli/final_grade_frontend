import { AxiosError } from "axios"
import errorType from "../services/apiTypes/Error"

export function getMessage(type: number = 0) {
    switch(type) {
        case 1: return 'Erro de validação.'
        case 2: return 'O servidor não conseguiu processar a requisição.'
        case 3: return 'O banco de dados rejeitou a operação para garantir a integridade dos dados.'
        case 4: return 'Acesso negado ou não autorizado.'
        case 5: return 'Sem conexão com o serviço. Verifique sua Internet.'
        default: return 'Erro não definido.'
    }
}

export function extractError(axiosError: AxiosError): errorType {
    const status = axiosError.response?
        axiosError.response.status : -1

    let error = { type: -1 } as errorType

    switch(status) {
        case 500:
            error = getError(axiosError, 2, 500)
            break;
        case 400: 
            error = getError(axiosError, 1, 400)
            break;
        case 401: 
            error = getError(axiosError, 4, 401)
            break;
        case 403: 
            error = getError(axiosError, 4, 403)
            break;
        case 404:
            error = getError(axiosError, 2, 404) 
            break;
        case 408: 
            error = getError(axiosError, 2, 408) 
            break;
        case 418: 
            error = getError(axiosError, 3, 418) 
            break;
        case 0:
            error = getError(axiosError, 5, 0) 
            break;
    }

    return error;
}

function getError(axiosError: AxiosError, type: number, status: number): errorType {
    let error = { type: type } as errorType

    if(axiosError.response) {
        if(axiosError.response.data) {
            try {
                JSON.stringify(axiosError.response.data)
                error = axiosError.response.data as errorType
            } catch (e) {
                error.message = axiosError.message
                console.error(axiosError.code+": "+axiosError.message)
            }
        }
    }

    error.status = status    
    return error;
}