import subjectType from "./Subject";

type packModuleSubjectType = {
    id: number;
    load: number;
    order: number;
    created_at: string;
    updated_at: string;
    subject: subjectType;
}

export default packModuleSubjectType;