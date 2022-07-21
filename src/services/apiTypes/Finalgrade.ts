import enrollmentType from "./Enrollment";
import subjectType from "./Subject";

type finalgradeType = {
    id: number;
    enrollment_id: number;
    subject_id: number;
    value: number;
    absences: number;
    created_at: string;
    updated_at: string;
    enrollment?: enrollmentType;
    subject?: subjectType;
}

export default finalgradeType;