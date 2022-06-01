import NpmPackage from "./NpmPackage.interface.mjs";

export default interface Submodule {
  name: string;
  path: string;
  url: string;
  branch: string;
  package: NpmPackage | undefined;
  // distPath: string;
  installDependencies(): Promise<void>;
  build(watch?: boolean): Promise<void>;
  copyNodeModules(): Promise<void>;
  // afterbuild(): void;
  watch(): Promise<void>;
  // init(config: { path?: string, url?: string, branch?: string }): Promise<Submodule>;
  // addFromRemoteUrl(args: AddSubmoduleArgs): Promise<Submodule>;
}

export interface SubmoduleStatic<T> {
  new (): T;
  getInstance(): T;
}

export type AddSubmoduleArgs = {
  url: string;
  branch?: string;
  overwrite?: { name: string; namespace: string };
};
