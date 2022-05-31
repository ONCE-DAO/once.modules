import GitRepository from "../2_systems/GitRepository.class.mjs";

console.log("BUILD.SCRIPT", process.env.WATCH);
console.log("PROCESS CWD", process.cwd());

const watch = process.env.WATCH == "true";
const repo = await GitRepository.init({ baseDir: process.cwd() });
const subs = await repo.getSubmodules();
//console.log(subs)
for (let sub of subs) {
  console.log("run for sub",sub.name)
  // try {
    await sub.installDependencies();
    await sub.copyNodeModules();
    await sub.build(watch);
  // } catch (error) {
  //   console.error("ERROR ", error);
  // }
  // break;
}
