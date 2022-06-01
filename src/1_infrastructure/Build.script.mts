import { DefaultGitRepository } from "../2_systems/GitRepository.class.mjs";
import DefaultSubmodule from "../2_systems/Submodule.class.mjs";

console.log("BUILD.SCRIPT", process.env.WATCH);
console.log("PROCESS CWD", process.cwd());

const watch = process.env.WATCH == "true";
const repo = await DefaultGitRepository.init({ baseDir: process.cwd() });
const subs = await repo.getSubmodules(DefaultSubmodule.initSubmodule);

console.log(subs.map((s) => s.name));
console.log(subs.sort(DefaultSubmodule.ResolveDependencies).map((s) => s.name));
for (let sub of subs.sort(DefaultSubmodule.ResolveDependencies)) {
  console.log(`run build for ${sub.name}@${sub.branch}`);
  await sub.copyNodeModules();
  await sub.build(watch);
}
