import { CourseLevels } from "../services/apiTypes/Course"

export function courseLevelRederer(level: number): string {
    switch(level) {
        case CourseLevels.LIVRE.value:
            return CourseLevels.LIVRE.label
        case CourseLevels.TEC.value:
            return CourseLevels.TEC.label
        case CourseLevels.POSLAT.value:
            return CourseLevels.POSLAT.label
        case CourseLevels.POSSTRICT.value:
            return CourseLevels.POSSTRICT.label
        case CourseLevels.SUP.value:
            return CourseLevels.SUP.label
        case CourseLevels.REG.value:
            return CourseLevels.REG.label
        default: 
            return 'Indefinido'
    }
}