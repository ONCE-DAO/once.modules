import { DefaultGitRepository } from "./GitRepository.class.mjs";
import { join } from "path";
import { execSync, spawn } from "child_process";
import Submodule from "../3_services/Submodule.interface.mjs";
import { DefaultNpmPackage } from "./NpmPackage.class.mjs";
import { cpSync, existsSync, rmdirSync, rmSync, symlinkSync, unlink, unlinkSync } from "fs";
import simpleGit, { SimpleGit } from "simple-git";
import GitRepository, {
  GitRepositoryParameter,
  NotAGitRepositoryError,
} from "../3_services/GitRepository.interface.mjs";

export default class DefaultSubmodule
  extends DefaultGitRepository
  implements Submodule, GitRepository {
  name: string;
  path: string;
  url: string;
  branch: string;
  basePath: string;
  package: DefaultNpmPackage;
  distributionFolder: string = "dist";

  static ResolveDependencies(
    a: Submodule & GitRepository,
    b: Submodule & GitRepository
  ): number {
    // console.log(
    //   `Sort: a [${a.package?.name} ${a.package?.onceDependencies?.join(
    //     ","
    //   )}] b [${b.package?.name}]  `
    // );
    if (
      b.package?.name &&
      a.package?.onceDependencies?.includes(b.package.name)
    ) {
      // console.log("a contains b as dependency. sort b before a");
      return 1;
    }

    if (
      a.package?.name &&
      b.package?.onceDependencies?.includes(a.package.name)
    ) {
      // console.log("b contains a as dependency. sort a before b");
      return -1;
    }

    if (a.package?.onceDependencies?.length) {
      // console.log("a contains  dependencies. sort b before a");
      return 1;
    }

    if (b.package?.onceDependencies?.length) {
      // console.log("b contains  dependencies. sort a before b");
      return -1;
    }

    // console.log("no dependency");
    return 0;
  }

  static async initSubmodule(
    name: string,
    path: string,
    url: string,
    branch: string,
    { baseDir, clone, init }: GitRepositoryParameter
  ): Promise<DefaultSubmodule> {
    const gitRepository = simpleGit(baseDir, { binary: "git" });

    if (!(await gitRepository.checkIsRepo()))
      throw new NotAGitRepositoryError();

    return new DefaultSubmodule(
      name,
      path,
      url,
      branch,
      baseDir,
      gitRepository
    );
  }

  protected constructor(
    name: string,
    path: string,
    url: string,
    branch: string,
    basePath: string,
    gitRepo: SimpleGit,
    distFolder: string = "dist"
  ) {
    const folderPath = join(basePath, path);
    super(gitRepo, branch, url, folderPath);
    this.name = name;
    this.path = path;
    this.url = url;
    this.branch = branch;
    this.basePath = basePath;
    this.package = DefaultNpmPackage.getByFolder(folderPath);
    this.distributionFolder = distFolder;
  }

  async installDependencies(): Promise<void> {
    console.log(`npm i ${join(this.basePath, this.path)}`);
    execSync("npm i", {
      stdio: "inherit",
      cwd: join(this.basePath, this.path),
    });
  }

  async build(watch: boolean = false): Promise<void> {
    // if (this.package && this.package.scripts && this.package.scripts.build) {
    //   console.log("BUILD SCRIPT EXIST");
    //   execSync(`npm --prefix ${join(this.basePath, this.path)} run build`, {
    //     stdio: "inherit",
    //   });
    // }


    if (existsSync(join(this.basePath, this.path, "tsconfig.json"))) {
      return await this.buildTypescript(watch);
    }
    // if (this.name !== 'thinglish.transformer') {
    //   if (ONCEClass === undefined) {
    //     ONCEClass = (await import("../../../../dist/once.merge/main/1_infrastructure/OnceKernel.class.mjs")).default;
    //     await ONCEClass.start();

    //   }
    //   let UcpComponentDescriptor = (await import("../../../../dist/once.merge/main/2_systems/ServerSideUcpComponentDescriptor.class.mjs")).default;
    //   let compDesc = new UcpComponentDescriptor().init({ path: join(this.basePath, this.path), relativePath: this.path });


    //   compDesc.writeToDistPath();
    // }
  }

  async copyNodeModules(): Promise<void> {
    if (existsSync(this.node_modules)) {
      existsSync(this.distribution_node_modules) && rmSync(this.distribution_node_modules, { recursive: true })
      console.log(`copy node_modules from ${this.node_modules} to ${this.distribution_node_modules}`)
      cpSync(this.node_modules, this.distribution_node_modules, { recursive: true, preserveTimestamps: true, force: true });
    }
  }

  watch(): Promise<void> {
    return this.build(true)
  }

  private async buildTypescript(watch: boolean) {
    execSync("npx tsc", {
      stdio: 'inherit',
      cwd: join(this.basePath, this.path),
    });
    console.log(`${this.name}@${this.branch} was builded using tsc`);


    this.createDistSymlink();
    this.copyPackageJson();

    if (watch) {
      spawn("npx", ["tsc", "--watch", "--preserveWatchOutput"], {
        stdio: 'inherit',
        cwd: join(this.basePath, this.path),
      });
      console.log(`${this.name}@${this.branch} is watching for changes`);
    }


  }

  private createDistSymlink() {

    const targetDir = join(this.basePath, this.path, "dist");

    try {
      rmSync(targetDir, { recursive: true })
    } catch {
    }

    try {
      unlinkSync(targetDir);
    } catch {
    }


    symlinkSync(this.distribution_dist, targetDir)
  }

  private copyPackageJson() {
    const packageOriginalPath = this.packageJsonPath;
    if (existsSync(packageOriginalPath)) {

      existsSync(this.distribution_packageJsonPath) && rmSync(this.distribution_packageJsonPath)
      console.log(`copy package.json from ${packageOriginalPath} to ${this.distribution_packageJsonPath}`)
      cpSync(packageOriginalPath, this.distribution_packageJsonPath);
    }
  }

  private get packageJsonPath() {
    return join(this.basePath, this.path, "package.json");
  }

  private get distribution_packageJsonPath() {
    return join(this.basePath, this.distributionFolder, "package.json");
  }

  private get distribution_dist() {
    return join(this.basePath, this.distributionFolder, "dist");
  }

  private get node_modules() {
    return join(this.basePath, this.path, "node_modules");
  }


  private get distribution_node_modules() {
    return join(this.basePath, this.distributionFolder, "node_modules");
  }
}