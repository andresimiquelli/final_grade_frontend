import packType from "./Pack";

type classType = {
    id: number;
    name: string;
    start_at: string;
    end_at: string;
    status: number;
    created_at: string;
    updated_at: string;
    pack?: packType;
}

export const ClassStatus = {
    WAITING: 0,
    ACTIVE: 1,
    FINISHED: 2
}

export default classType;