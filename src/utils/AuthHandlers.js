let func = null

export function addLogOutFunc(logOutFunc) {
    func = logOutFunc
}

export function ForceLogout() {
    if (func) func()
}