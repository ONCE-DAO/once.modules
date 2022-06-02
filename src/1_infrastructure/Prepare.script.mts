import { execSync } from "child_process";
import { DefaultGitRepository } from "../2_systems/GitRepository.class.mjs";
import DefaultSubmodule from "../2_systems/Submodule.class.mjs";

execSync("git submodule update --init --remote --recursive", {
  stdio: "inherit",
});

const repo = await DefaultGitRepository.init({ baseDir: process.cwd() });
const subs = await repo.getSubmodules(DefaultSubmodule.initSubmodule);

for (let sub of subs) {
  if (sub.folderPath.includes("3rdParty")) {
    console.log("skip ", sub.name);
    continue;
  }
  await sub.checkout(sub.branch);
  await sub.installDependencies();
}
