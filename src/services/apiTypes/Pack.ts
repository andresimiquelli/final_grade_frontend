import courseType from "./Course";

type packType = {
    id: number;
    course_id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    course?: courseType;
}

export default packType;