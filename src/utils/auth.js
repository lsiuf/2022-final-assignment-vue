import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getJWT(){
  return window.localStorage.getItem("jwt")
}

export function setJWT(jwt){
  window.localStorage.setItem("jwt",jwt)
}

export function getRole(){
  return window.localStorage.getItem("role")
}

export function setRole(role){
  window.localStorage.setItem("role",role)
}