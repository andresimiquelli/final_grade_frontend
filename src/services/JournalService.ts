import axios, { AxiosError } from "axios";
import { baseUrl } from "./api"
import journalType from "./apiTypes/Journal";

export const statusPermissions = {
    LOADING: -1,
    OPEN: 0,
    CLOSED: 1,
    ERROR: 2
}

class JournalService {

    protected api = axios.create({
        baseURL: baseUrl
    })

    public async getStatus(
        class_id: number | string | undefined, 
        subject_id: number | string | undefined, 
        token: string): Promise<number> {

        this.setToken(token)
    
        try {
            const response = await this.api.get(`/journals/${class_id}/${subject_id}`);
            const journal = response.data as journalType
            return journal.status? journal.status : statusPermissions.OPEN
        } catch(exeception) {
            const error = exeception as AxiosError
            if(error.request.status)
                if(error.request.status === 404)
                    return statusPermissions.OPEN

            return statusPermissions.ERROR
        }    
    }

    private setToken(token: string) {
        this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
}

export default new JournalService()