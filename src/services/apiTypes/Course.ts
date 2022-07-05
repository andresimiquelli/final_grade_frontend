type courseType = {
    id: number;
    name: string;
    level: number;
    created_at: string;
    updated_at: string;
}

export const CourseLevels = {
    TEC: { value: 1, label: 'Técnico'},
    LIVRE: { value: 2, label: 'Livre'},
    POSLAT: { value: 3, label: 'Latu sensu'},
    POSSTRICT: { value: 4, label: 'Strictu sensu'},
    SUP: { value: 5, label: 'Superior'},
    REG: { value: 6, label: 'Regular'}
}

export default courseType;