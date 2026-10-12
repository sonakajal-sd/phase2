import { hashPassword,comparePassword } from "./password.js";

// const hash= await hashPassword("hello123");

// console.log(hash);


const compare= await comparePassword("hello123","$2b$10$csQMKR93MH6bXq2ADwnHB.Zn5AKk9J0C5jpnyKwMMVmXFVaPDt/Tm");

console.log(compare);