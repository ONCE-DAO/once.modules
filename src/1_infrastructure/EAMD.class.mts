import simpleGit, { SimpleGit } from "simple-git";
import { DefaultGitRepository } from "../2_systems/GitRepository.class.mjs";
import DefaultScenario from "../2_systems/Scenario.class.mjs";
import DefaultSubmodule from "../2_systems/Submodule.class.mjs";
import EAMD from "../3_services/EAMD.interface.mjs";
import ScenarioInterface from "../3_services/Scenario.interface.mjs";

export default class DefaultEAMD extends DefaultGitRepository implements EAMD {
  installationDirectory: string = "";
  scenario: ScenarioInterface;

  static async getInstance(baseDirectory: string): Promise<EAMD> {
    const gitRepository = simpleGit(baseDirectory, { binary: "git" });
    const branch = await DefaultEAMD.getBranch(gitRepository)
    const remoteUrl = await DefaultEAMD.getRemoteUrl(gitRepository)
    return new DefaultEAMD(baseDirectory, gitRepository, branch, remoteUrl)
  }

  constructor(baseDirectory: string, gitRepository: SimpleGit, branch: string, remoteUrl: string) {
    super(gitRepository, branch, remoteUrl, baseDirectory)
    this.scenario = new DefaultScenario(this)
  }

  async build(watch: boolean = false): Promise<void> {
    const subs = await this.getSubmodules(DefaultSubmodule.initSubmodule);
    for (let sub of subs.sort(DefaultSubmodule.ResolveDependencies)) {
      console.log(sub.folderPath, sub.folderPath.includes("3rdParty"))
      if (sub.folderPath.includes("3rdParty")) continue;
      console.log(`run build for ${sub.name}@${sub.branch}`);
      await sub.copyNodeModules();
      console.log("node_modules copied");

      await sub.build(watch);
    }
  }
}
