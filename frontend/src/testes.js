let dados = "Segunda-feira, 14:00 a 16:00\nQuinta-feira, 16:00 a 18:00";
let dia = "Segunda-feira";
let reg = new RegExp(`${dia}, ([0-9]{2}:[0-9]{2} a [0-9]{2}:[0-9]{2})`, "i")
//let n = dados.match(/Segunda-feira, ([0-9]{2}:[0-9]{2} a [0-9]{2}:[0-9]{2})/i);
let n = dados.match(reg);
console.log(n[1]);