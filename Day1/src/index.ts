import os from "node:os";
import {
    getNodeVersion,
    getOperatingSystem,
    getMemoryInfo,
    getCurrentDirectory,
    getNodeEnvironment,
} from "./system-info"

const command= process.argv[2];

if(command === "version"){
    console.log(`Node version: ${process.version}`);
}
else if(command ==="os"){
    console.log(`Operating System: ${os.platform()}`);
}

else if(command=== "memory"){
    const totalMemory= os.totalmem();
    const freeMemory=os.freemem();

    const totalGB= totalMemory/1024 **3;
    const freeGB= freeMemory/1024 **3;

    console.log(`Total memory: ${totalGB.toFixed(2)} GB`);
    console.log(`Free memory: ${freeGB.toFixed(2)} GB`);
}

else if(command === "cwd"){
    console.log(`Current Directory: ${process.cwd()}`);
}
 else if(command === "env"){
    console.log(`NODE_ENV: ${process.env.NODE_ENV ?? "not set"}`);
}

else if(command){
    console.log(`Unknown command: ${command}`);
    console.log(`Available commands: version |os| memory| cwd |env`);
}
else{
    console.log("Please provide a command");
    console.log("Available commands: version| os| memory| cwd |env");
}