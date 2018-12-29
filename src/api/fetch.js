import axios from "axios"
//与后台进行通信
let formatParams = function(obj={}){
  let temp = ''
  Object.values(obj).forEach(el => {
    temp = `${temp}/${el}`
  })
  return temp 
}

export const util = {
  formatParams
}

export default axios.create({
  timeout: 5000,
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  baseURL: "http://10.19.144.124:8119"
})