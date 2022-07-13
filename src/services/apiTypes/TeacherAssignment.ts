import classType from "./Class";
import subjectType from "./Subject";
import teacherType from "./Teacher";

type teacherAssignmentType = {
    id: number;
    teacher: teacherType;
    subject: subjectType;
    cclass: classType;
    start_at: string;
    end_at?: string;
    createds_at: string;
    updated_at: string;
}

export default teacherAssignmentType;