import { join } from "path";
import { existsSync, mkdirSync } from "fs";
// import { execSync } from "child_process";
import { execSync } from "child_process";
import { DefaultGitRepository } from "../2_systems/GitRepository.class.mjs";
import DefaultSubmodule from "../2_systems/Submodule.class.mjs";

execSync("npx ts-patch install", {
  stdio: "inherit",
});

const repo = await DefaultGitRepository.init({ baseDir: process.cwd() });
const subs = await repo.getSubmodules(DefaultSubmodule.initSubmodule);

for (let sub of subs) {
  if (sub.folderPath.includes("3rdParty")) {
    console.log("skip ", sub.name);
    continue;
  }
  if (sub.package?.devDependencies && sub.package.devDependencies["ts-patch"]) {
    console.log("npx ts-patch install @", sub.folderPath);
    execSync("npx ts-patch install", {
      stdio: "inherit",
      cwd: sub.folderPath,
    });
  }

  await sub.checkout(sub.branch);
  await sub.installDependencies();
}

!existsSync("Scenarios") && mkdirSync("Scenarios");
