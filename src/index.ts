import { connection } from "./connection"
//import { Friends } from "./entities/Friends";

const main : any = async () => {
    await connection;
    console.log("test");
    
    //await Friends.create({friendOne: 1, friendTwo: 2}).save();
    
}

main();