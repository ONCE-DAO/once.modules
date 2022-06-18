import GitRepository from "./GitRepository.interface.mjs";
import Scenario from "./Scenario.interface.mjs";

export default interface EAMD extends GitRepository {
  installationDirectory: string;
  build(watch?: boolean): Promise<void>
  scenario: Scenario
  // installedAt: Date | undefined;
  // preferredFolder: string[];
  // eamdDirectory: string | undefined;

  //   install(): Promise<EAMD>;
  //   hasWriteAccess(): boolean;
  //   isInstalled(): boolean;
  //   getInstalled(): Promise<EAMD>;
  //   init(path: string): EAMD;
  //   update(): Promise<EAMD>;
  //   test(): void;
  //   discover(): Promise<Object>;
  //   getInstallDirectory(): string | undefined;
}


export enum EAMD_FOLDERS {
  ROOT = "EAMD.ucp",
  COMPONENTS = "Components",
  SCENARIOS = "Scenarios",
  MISSING_NAMESPACE = "MISSING_NAMESPACE"
}
