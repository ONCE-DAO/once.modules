// import fs, { cpSync, existsSync, fstat, mkdirSync, renameSync } from "fs";
// import { join, relative } from "path";
// import simpleGit, { Options, SimpleGit, TaskOptions } from "simple-git";

import { execSync } from "child_process";
import simpleGit, { SimpleGit } from "simple-git";
import GitRepository, {
  GitRepositoryParameter,
  NotAGitRepositoryError,
} from "../3_services/GitRepository.interface.mjs";
import SubmoduleInterface from "../3_services/Submodule.interface.mjs";
import DefaultSubmodule from "./Submodule.class.mjs";

// import GitRepository, {
//   GitCloneParameter,
//   GitRepositoryNotInitialisedError,
//   GitRepositoryParameter,
//   Result,
// } from "../3_services/GitRepository.interface.mjs";
// import SubmoduleInterface from "../3_services/Submodule.interface.mjs";
// import DefaultSubmodule from "./Submodule.class.mjs";
export default class DefaultGitRepository implements GitRepository {
  folderPath: string = "";
  currentBranch: string;
  remoteUrl: string;
  private gitRepository: SimpleGit;

  async getSubmodules(): Promise<SubmoduleInterface[]> {
    const submodules: SubmoduleInterface[] = [];
    const modules = execSync("git submodule foreach --quiet 'echo $name'", {
      encoding: "utf8",
    })
      .split("\n")
      .filter((e) => e);


      
    for (let module of modules) {
      const active =
        (await this.gitRepository.getConfig(`submodule.${module}.active`))
          .value === "true";
      if (!active) continue;
      submodules.push(
        new DefaultSubmodule(
          module,
          await this.getSubmoduleValue(`submodule.${module}.path`),
          await this.getSubmoduleValue(`submodule.${module}.url`),
          await this.getSubmoduleValue(`submodule.${module}.branch`),
          this.folderPath
        )
      );
    }
    return submodules;
  }

  private async getSubmoduleValue(key: string): Promise<string> {
    const rawResult = await this.gitRepository.raw(
      "config",
      "--file",
      ".gitmodules",
      "--get",
      key
    );
    return rawResult.replace(/\n$/, "");
  }
  static async init({
    baseDir,
    clone,
    init,
  }: GitRepositoryParameter): Promise<GitRepository> {
    const gitRepository = simpleGit(baseDir, { binary: "git" });

    if (!(await gitRepository.checkIsRepo()))
      throw new NotAGitRepositoryError();

    return new DefaultGitRepository(
      gitRepository,
      await this.getBranch(gitRepository),
      await this.getRemoteUrl(gitRepository)
    );
  }

  private static async getRemoteUrl(gitRepository: SimpleGit): Promise<string> {
    const config = await gitRepository.getConfig("remote.origin.url");
    return config.value || "";
  }

  private static async getBranch(gitRepository: SimpleGit): Promise<string> {
    const status = await gitRepository.status();
    return status.current || "";
  }

  private constructor(gitRepo: SimpleGit, branch: string, remoteUrl: string) {
    this.gitRepository = gitRepo;
    this.currentBranch = branch;
    this.remoteUrl = remoteUrl;
  }

  // get repoName(): Promise<string | undefined> {
  //   return new Promise(async (resolve) => {
  //     if (!this.gitRepo) return undefined;
  //     const pkg = await NpmPackage.getByFolder(this.gitRepo[1]);
  //     resolve(pkg?.name);
  //   });
  // }
}
