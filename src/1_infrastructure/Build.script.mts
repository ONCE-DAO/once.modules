import DefaultEAMD from "./EAMD.class.mjs";

console.log("BUILD.SCRIPT", process.env.WATCH);
console.log("PROCESS CWD", process.cwd());

const watch = process.env.WATCH == "true";

const eamd = await DefaultEAMD.getInstance(process.cwd())
await eamd.build(watch);
