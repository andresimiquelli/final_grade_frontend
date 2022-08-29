type journalType = {
    course_id: number;
    pack_id: number;
    pack_name: string;
    pack_module_name: string;
    pack_module_subject_id: number;
    subject_id: number;
    subject_name: string;
    subject_load: number;
    order: number;
    status?: number;
}

export default journalType;