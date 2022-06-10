import simpleGit, { SimpleGit } from "simple-git";
import { DefaultGitRepository } from "../2_systems/GitRepository.class.mjs";
import EAMD from "../3_services/EAMD.interface.mjs";
export default class DefaultEAMD extends DefaultGitRepository implements EAMD {
  installationDirectory: string = "";

  static async getInstance(baseDirectory: string): Promise<EAMD> {
    const gitRepository = simpleGit(baseDirectory, { binary: "git" });
    const branch = await DefaultEAMD.getBranch(gitRepository)
    const remoteUrl = await DefaultEAMD.getRemoteUrl(gitRepository)
    return new DefaultEAMD(baseDirectory, gitRepository, branch, remoteUrl)
  }

  constructor(baseDirectory: string, gitRepository: SimpleGit, branch: string, remoteUrl: string) {
    super(gitRepository, branch, remoteUrl, baseDirectory)
  }

  // folderPath: string;
  // currentBranch: string;    
  // remoteUrl: string;
  // getSubmodules(): Promise<(SubmoduleInterface & GitRepository)[]> {
  //   throw new Error("Method not implemented.");
  // }
  // init({
  //   baseDir,
  //   clone,
  //   init,
  // }: GitRepositoryParameter): Promise<GitRepository> {
  //   throw new Error("Method not implemented.");
  // }
  // installedAt: Date | undefined;
  // preferredFolder: string[];
  // installationDirectory: string | undefined;
  // eamdDirectory: string | undefined;

  // constructor() {
  //   this.folderPath = "";
  //   this.currentBranch = "";
  //   this.remoteUrl = "";
  //   this.preferredFolder = [];
  // }
  // updateSubmodules(): void {
  //   throw new Error("Method not implemented.");
  // }
  // checkout(branch: string): Promise<void> {
  //   throw new Error("Method not implemented.");
  // }
}
