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

export type finalgradeReportType = {
    enrollment_id: number;
    pack_module_subject_id: number;
    class_id: number;
    student_name: string;
    absences: number;
    grade: string | number;
}

export default finalgradeType;