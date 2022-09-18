import { compareAsc } from 'date-fns';

function dateCompare(start: string, end: string) : number {
    const dateStart = new Date(start);
    const dateEnd = new Date(end);
    return compareAsc(dateStart, dateEnd);
}

export default dateCompare;