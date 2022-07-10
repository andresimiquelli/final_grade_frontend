export function subjectLoadRenderer(load: number): string {
    let hours = 0;

    if(load > 59)
        hours = Math.floor(load/60);

    let min = load;

    if(hours > 0)
        min = load%60;

    let str = "";

    if(hours > 0)
        str += hours+"h ";

    if(min > 0)
        str += min+"min ";

    return str;
}
