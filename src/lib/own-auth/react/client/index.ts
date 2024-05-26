"use client";

export { useUser } from "./internal/UserContext";


export const signOut = () => {
  const sessionId = getCookie("sessionId");
  if(sessionId){
    const fd = new FormData();
    fd.append("sessionId", sessionId)
    fetch("/api/auth/logout", {
      body:fd,
      method:"POST"
    }).then(() => {
      console.log("LOGGED OUT")
    }).catch(err => {
      console.log(`SIGN OUT ERR: ${err}`)
    }).finally(() => {
      document.cookie = `sessionId=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`
      location.href = "/login";    
    })
  }
}

function getCookie(name: string){
  let value = null;
  document.cookie.split(";").forEach((cookie) => {
    const cookieKV = cookie.split("=")
    if(cookieKV[0] === name){
      value = cookieKV[1]
    }
  })
  return value
}