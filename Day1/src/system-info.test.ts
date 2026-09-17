import { describe,it, expect } from "@jest/globals";
import { getNodeVersion, getOperatingSystem,getMemoryInfo ,getCurrentDirectory,getNodeEnvironment} from "./system-info";

describe("getNodeVersion",()=>{
    it("should return the Node.js version",()=>{
        const result= getNodeVersion();

        expect(result).toBe(process.version)
    })
});

describe("getOperatingSystem",()=>{
    it("should return the Node.js os",()=>{
        const result= getOperatingSystem();

        expect(result).toBe(process.platform);
    });
});

describe("getMemoryInfo",()=>{
    it("should return the Node.js Memory",()=>{
        const result=getMemoryInfo();

        expect(result).toHaveProperty("totalGB");
        expect(result).toHaveProperty("freeGB");
    });
});

describe("getCurrentDirectory",()=>{
    it("should return the current Directory",()=>{
        const result= getCurrentDirectory();

        expect(result).toBe(process.cwd());
    })
});

describe("getNodeEnvironment",()=>{
    it("Should return the Current Environmnt",()=>{
       const originalValue=process.env.NODE_ENV;

       process.env.NODE_ENV ="test";

       const result=getNodeEnvironment();
       
       expect(result).toBe("test");

       process.env.NODE_ENV= originalValue;
    })
})