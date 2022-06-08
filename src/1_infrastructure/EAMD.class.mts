import EAMD from "../3_services/EAMD.interface.mjs";
import GitRepository, {
  GitRepositoryParameter,
} from "../3_services/GitRepository.interface.mjs";
import SubmoduleInterface from "../3_services/Submodule.interface.mjs";

export default class DefaultEAMD implements GitRepository, EAMD {
  folderPath: string;
  currentBranch: string;
  remoteUrl: string;
  getSubmodules(): Promise<(SubmoduleInterface & GitRepository)[]> {
    throw new Error("Method not implemented.");
  }
  init({
    baseDir,
    clone,
    init,
  }: GitRepositoryParameter): Promise<GitRepository> {
    throw new Error("Method not implemented.");
  }
  installedAt: Date | undefined;
  preferredFolder: string[];
  installationDirectory: string | undefined;
  eamdDirectory: string | undefined;

  constructor() {
    this.folderPath = "";
    this.currentBranch = "";
    this.remoteUrl = "";
    this.preferredFolder = [];
  }
  updateSubmodules(): void {
    throw new Error("Method not implemented.");
  }
  checkout(branch: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
