const HttpError=require('./httpError');
function str(v,f,max,min=1){if(typeof v!=='string')throw new HttpError(400,`${f} é obrigatório.`);const s=v.trim();if(s.length<min||s.length>max)throw new HttpError(400,`${f} deve ter entre ${min} e ${max} caracteres.`);return s}
function opt(v,f,max){return v===undefined||v===null||v===''?null:str(v,f,max)}
function phone(v,f='Telefone'){const s=str(v,f,20),d=s.replace(/\D/g,'');if(![10,11].includes(d.length))throw new HttpError(400,`${f} deve conter DDD e número (10 ou 11 dígitos).`);return d}
function pin(v){if(typeof v!=='string'||!/^\d{4,8}$/.test(v))throw new HttpError(400,'PIN deve conter de 4 a 8 números.');return v}
function id(v){const n=Number(v);if(!Number.isSafeInteger(n)||n<1)throw new HttpError(400,'ID inválido.');return n}
function date(v,f='Data'){const d=new Date(v);if(!v||Number.isNaN(d.getTime()))throw new HttpError(400,`${f} inválida.`);return d}
module.exports={str,opt,phone,pin,id,date};