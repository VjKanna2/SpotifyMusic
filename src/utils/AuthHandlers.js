let func = null

export function addLogOutFunc(logOutFunc) {
    func = logOutFunc

    return () => {
        func = null;
    }
}

export function ForceLogout() {
    if (func) func()
}