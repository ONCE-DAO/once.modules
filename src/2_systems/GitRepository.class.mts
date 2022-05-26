// import fs, { cpSync, existsSync, fstat, mkdirSync, renameSync } from "fs";
// import { join, relative } from "path";
// import simpleGit, { Options, SimpleGit, TaskOptions } from "simple-git";

import simpleGit, { SimpleGit } from "simple-git";
import GitRepository, {
  GitRepositoryParameter,
} from "../3_services/GitRepository.interface.mjs";
import SubmoduleInterface from "../3_services/Submodule.interface.mjs";

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
  currentBranch: string = "";
  remoteUrl: string = "";
  gitRepository: SimpleGit;

  getSubmodules(): Promise<SubmoduleInterface[]> {
    throw new Error("Method not implemented.");
  }

  init({
    baseDir,
    clone,
    init,
  }: GitRepositoryParameter): Promise<GitRepository> {
    throw new Error("Method not implemented.");
  }

  static async init({
    baseDir,
    clone,
    init,
  }: GitRepositoryParameter): Promise<GitRepository> {
    return new DefaultGitRepository({ baseDir });
  }

  private constructor({ baseDir, clone, init }: GitRepositoryParameter) {
    this.gitRepository = simpleGit(baseDir, { binary: "git" });
  }
}
