import classType from "./Class";
import subjectType from "./Subject";
import userType from "./User";

type userAssignmentType = {
    id: number;
    teacher: userType;
    subject: subjectType;
    cclass: classType;
    start_at: string;
    end_at?: string;
    createds_at: string;
    updated_at: string;
}

export default userAssignmentType;