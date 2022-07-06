import userType from "./User";

type teacherType = {
    id: number;
    user: userType;
    created_at: string;
    updated_at: string;
}

export default teacherType;