export function dateRenderer(date: string | null | undefined, format: 'mx' | 'br' | 'brt' = 'mx'): string {
    return date? date===null? '' : formatMx(date) : ''
}

function formatMx(date: string): string {
    let date_r = date.split(' ')
    let date_array = date_r[0].split('-')

    return date_array[2]+" de "+getMonth(parseInt(date_array[1]))+" de "+date_array[0]
}

function getMonth(month: number, format: 'm' | 'mm' = 'm'): string {
    switch(month) {
        case 1:
            return format==='m' ? 'jan' : 'janeiro';
        case 2:
            return format==='m' ? 'fev' : 'fevereiro';
        case 3:
            return format==='m' ? 'mar' : 'março';
        case 4:
            return format==='m' ? 'abr' : 'abril';
        case 5:
            return format==='m' ? 'mai' : 'maio';
        case 6:
            return format==='m' ? 'jun' : 'junho';
        case 7:
            return format==='m' ? 'jul' : 'julho';
        case 8:
            return format==='m' ? 'ago' : 'agosto';
        case 9:
            return format==='m' ? 'set' : 'setembro';
        case 10:
            return format==='m' ? 'out' : 'outubro';
        case 11:
            return format==='m' ? 'nov' : 'novembro';
        case 12:
            return format==='m' ? 'dez' : 'fevereiro';
        default:
            return '';
    }
}