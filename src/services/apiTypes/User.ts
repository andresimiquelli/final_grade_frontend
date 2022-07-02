type userType = {
    id: number;
    email: string;
    name: string;
    type: number;
    status: number;
    created_at: string;
    updated_at: string;
}

export const UserType = {
    ADMIN: {value: 1, label: "Administração"},
    COORD: {value: 2, label: "Coordenação"},
    PROF: {value: 3, label: "Professor(a)"}
}

export const UserStatus = {
    ACTIVE: 1,
    INACTIVE: 0
}

export default userType;