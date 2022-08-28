import classType from "./Class";
import packModuleSubjectType from "./PackModuleSubject";
import userType from "./User";

type userAssignmentType = {
    id: number;
    teacher: userType;
    subject: packModuleSubjectType;
    cclass: classType;
    start_at: string;
    end_at?: string;
    createds_at: string;
    updated_at: string;
}

export default userAssignmentType;