import classType from "./Class";
import enrollmentAbsenceType from "./EnrollmentAbsence";
import evaluationGradeType from "./EvaluationGrade";
import finalgradeType from "./Finalgrade";
import studentType from "./Student";

type enrollmentType = {
    id: number;
    student_id: number;
    class_id: number;
    start_at: string;
    end_at?: string;
    status: number;
    created_at: string;
    updated_at: string;
    student?: studentType;
    cclass?: classType;
    absences?: enrollmentAbsenceType[];
    grades?: evaluationGradeType[];
    finalgrades?: finalgradeType[];
}

export default enrollmentType;