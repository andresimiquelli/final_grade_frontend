import packType from "./Pack";
import packModuleSubjectType from "./PackModuleSubject";

type packModuleType = {
    id: number;
    name: string;
    description: string;
    order: number;
    created_at: string;
    updated_at: string;
    pack?: packType;
    subjects?: packModuleSubjectType[];
}

export default packModuleType;