import { join } from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { DefaultGitRepository } from "../2_systems/GitRepository.class.mjs";
import DefaultScenario from "../2_systems/Scenario.class.mjs";
import DefaultSubmodule from "../2_systems/Submodule.class.mjs";
import EAMD from "../3_services/EAMD.interface.mjs";
import GitRepository from "../3_services/GitRepository.interface.mjs";
import Scenario from "../3_services/Scenario.interface.mjs";
import Submodule from "../3_services/Submodule.interface.mjs";

export default class DefaultEAMD extends DefaultGitRepository implements EAMD {
  installationDirectory: string;
  scenario: Scenario;

  static async getInstance(scenario: DefaultScenario): Promise<EAMD> {
    const gitRepository = simpleGit(scenario.eamdPath, { binary: "git" });
    const branch = await DefaultEAMD.getBranch(gitRepository)
    const remoteUrl = await DefaultEAMD.getRemoteUrl(gitRepository)
    return new DefaultEAMD(scenario, gitRepository, branch, remoteUrl)
  }

  constructor(scenario: Scenario, gitRepository: SimpleGit, branch: string, remoteUrl: string) {
    super(gitRepository, branch, remoteUrl, scenario.eamdPath)
    this.installationDirectory = scenario.eamdPath;
    this.scenario = scenario;
  }

  async build(watch: boolean = false): Promise<void> {
    for (let sub of await this.getSortedSubmodules()) {

      console.log(`run build for ${sub.name}@${sub.branch}`);
      await sub.copyNodeModules();
      console.log("node_modules copied");

      await sub.build(watch);
    }
  }

  async runForSubmodules(fn: (submodule: Submodule & GitRepository) => Promise<void>): Promise<void> {
    for (let sub of await this.getSortedSubmodules()) {
      await fn(sub)
    }
  }

  private getDistFolderForSubmodule(submodule: Submodule) {
    return join(this.scenario.scenarioPath, submodule.package.package)
  }

  private async getSortedSubmodules(): Promise<(Submodule & GitRepository)[]> {
    return (await this.getSubmodules(DefaultSubmodule.initSubmodule))
      .sort(DefaultSubmodule.ResolveDependencies)
      .filter(x => !x.folderPath.includes("3rdParty"))
  }
}
