import enrollmentType from "./Enrollment";
import lessonType from "./Lesson";

type enrollmentAbsenceType = {
    id: number;
    enrollment_id: number;
    lesson_id: number;
    created_at: string;
    updated_at: string;
    enrollment?: enrollmentType;
    lesson?: lessonType;
}

export default enrollmentAbsenceType;