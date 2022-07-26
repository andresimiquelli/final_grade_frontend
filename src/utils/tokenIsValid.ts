export function tokenIsValid(expiresIn: number, updatedAt: number): boolean {
    const now = new Date().getTime()
    if(now < updatedAt+(expiresIn*1000))
        return true
    else
        return false
}