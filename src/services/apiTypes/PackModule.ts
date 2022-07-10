import packType from "./Pack";

type packModuleType = {
    id: number;
    name: string;
    description: string;
    order: number;
    created_at: string;
    updated_at: string;
    pack?: packType;
}

export default packModuleType;