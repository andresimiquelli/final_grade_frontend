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

export const JournalStatus = {
    OPEN: 0,
    CLOSED: 1
}

export default journalType;