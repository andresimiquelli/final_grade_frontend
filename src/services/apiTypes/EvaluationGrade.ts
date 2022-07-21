import enrollmentType from "./Enrollment";
import evaluationType from "./Evaluation";

type evaluationGradeType = {
    id: number;
    evaluation_id: number;
    enrollment_id: number;
    value: number;
    created_at: string;
    updated_at: string;
    evaluation?: evaluationType;
    enrollment?: enrollmentType;
}

export default evaluationGradeType;