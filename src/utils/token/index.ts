import {getLocalStorage, setLocalStorage} from "../localStorage";
import {Token_Type} from "./type";

const TokenLocalStorageName = "FormGather-Token";

export const getTokenLocalstorage = (): Token_Type => {
    const tokenRead = getLocalStorage(TokenLocalStorageName)
    let tokens:Token_Type = {}
    if (tokenRead !== null) tokens = tokenRead
    if(!tokens?.accessToken) tokens.accessToken = null
    if(!tokens?.refreshToken) tokens.refreshToken = null
    return tokens
}

export const setTokenLocalstorage = (tokens: Token_Type) => {
    const tempToken: {[key: string]: string} = {}
    if(tokens.accessToken) tempToken.accessToken = tokens.accessToken
    if(tokens.refreshToken) tempToken.refreshToken = tokens.refreshToken
    return setLocalStorage(TokenLocalStorageName, tempToken)
}
