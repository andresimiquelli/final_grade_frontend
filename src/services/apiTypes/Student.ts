type studentType = {
    id: number;
    email: string;
    name: string;
    phone: string;
    created_at: string;
    updated_at: string;
}

export const StudentStatus = {
    ACTIVE: 1,
    INACTIVE: 0
}

export default studentType;