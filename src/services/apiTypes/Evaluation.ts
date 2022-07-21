import classType from "./Class";
import evaluationGradeType from "./EvaluationGrade";
import packModuleSubjectType from "./PackModuleSubject";
import userType from "./User";

type evaluationType = {
    id: number;
    user_id: number;
    class_id: number;
    pack_module_subject_id: number;
    name: string;
    value: number;
    created_at: string;
    updated_at: string;
    teacher?: userType;
    cclass?: classType;
    packModuleSubject?: packModuleSubjectType;
    grades?: evaluationGradeType[];
}

export default evaluationType;