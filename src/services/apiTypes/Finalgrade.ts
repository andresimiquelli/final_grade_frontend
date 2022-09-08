import enrollmentType from "./Enrollment";
import packModuleSubjectType from "./PackModuleSubject";

type finalgradeType = {
    id: number;
    enrollment_id: number;
    pack_module_subject_id: number;
    value: number;
    absences: number;
    created_at: string;
    updated_at: string;
    enrollment?: enrollmentType;
    subject?: packModuleSubjectType;
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