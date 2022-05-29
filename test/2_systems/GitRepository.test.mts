import { mkdirSync, mkdtempSync, rmdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import * as path from "path";
import { join } from "path";
import simpleGit from "simple-git";
import DefaultGitRepository from "../../../../dist/once.modules/main/2_systems/GitRepository.class.mjs";
import { NotAGitRepositoryError } from "../../../../dist/once.modules/main/3_services/GitRepository.interface.mjs";

let tempdir = "";
beforeAll(async () => {
  tempdir = mkdtempSync(path.join(tmpdir(), "testrun-"));
  const git = simpleGit(tempdir, {});
  await git.clone("https://github.com/ONCE-DAO/testrepo.git");
});

// const currentFile = fileURLToPath(import.meta.url);

// mkdirSync(norepoPath);

describe("When initialising a git repository", () => {
  test("remote url and current branch have to be detected", async () => {
    const testrepoPath = join(tempdir, "testrepo");
    const repo = await DefaultGitRepository.init({ baseDir: testrepoPath });
    expect(repo.remoteUrl).toBe("https://github.com/ONCE-DAO/testrepo.git");
    expect(repo.currentBranch).toBe("main");
  });

  test("exception have to be thrown when folder is not a git repository", async () => {
    const norepoPath = join(tempdir, "norepo");
    mkdirSync(norepoPath);

    const initFn = async () =>
      await DefaultGitRepository.init({ baseDir: norepoPath });

    await expect(initFn()).rejects.toThrow(NotAGitRepositoryError);
  });

  test("remote url and current branch have to be detected", async () => {
    const repo = await DefaultGitRepository.init({ baseDir: process.cwd() });
    // expect(repo.remoteUrl).toBe("https://github.com/ONCE-DAO/testrepo.git");
    // expect(repo.currentBranch).toBe("main");
   const f =  await repo.getSubmodules()

   console.log(f)
  });
});

afterAll(() => {
  tempdir !== "" && rmSync(tempdir, { recursive: true, force: true });
});
