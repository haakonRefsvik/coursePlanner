import { getCurrentMonth, getCurrentYear } from "./parseDate"

// returns semester on the form: 25h (2025 autumn)
export function getSemesterString(year: number): string{
    const floored = Math.floor(year)
    const springSemester: boolean = year == floored
    let suffix = "h"
    if (springSemester){
        suffix = "v"
    }
    return floored + suffix
}

export function getHumanReadableSemester(year: number){
    const floored = Math.floor(year)
    const springSemester: boolean = year == floored
    if(springSemester){
        return "Vår " + floored
    }

    return "Høst " + floored 
}

// either year (spring) or year + 0.5 (autumn)
export function getNextSemester(): number{
    let ret = getCurrentYear()
    // gets spring semester when you are in October - Desember 
    if (getCurrentMonth() >= 10){
        ret = ret + 1        
    }

    // gets the autumn semester when you are in April - October
    if (getCurrentMonth() >= 4){
        ret = ret + 0.5        
    }

    // get spring semester January - April 
    ret = parseInt(ret.toString().substring(2, 4))

    return ret
}