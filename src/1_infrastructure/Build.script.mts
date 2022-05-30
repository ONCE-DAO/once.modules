import GitRepository from "../2_systems/GitRepository.class.mjs";

console.log("BUILD.SCRIPT", process.env.WATCH);
console.log("PROCESS CWD", process.cwd());

const watch = process.env.WATCH == "true";
const repo = await GitRepository.init({ baseDir: process.cwd() });
const subs = await repo.getSubmodules();

for (let sub of subs) {
  try {
    await sub.copyNodeModules();
    await sub.installDependencies();
    await sub.build();
  } catch (error) {
    console.error("ERROR ", error);
  }
  break;
}
