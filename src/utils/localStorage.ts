export const getLocalStorage = (name: string) => {
    const data = localStorage.getItem(name)
    try {
        if(!data) return  null
        return JSON.parse(data)
    }catch (e){
        return null
    }
}

export const setLocalStorage = (name: string, data: any) => {
    try {
        const strData = JSON.stringify(data)
        localStorage.setItem(name, strData)
        return true
    }catch (e){
        return false
    }

}