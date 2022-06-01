import { mkdirSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import * as path from "path";
import { join } from "path";
import simpleGit from "simple-git";
import { DefaultGitRepository } from "../../src/2_systems/GitRepository.class.mjs";
import DefaultSubmodule from "../../src/2_systems/Submodule.class.mjs";
import { NotAGitRepositoryError } from "../../src/3_services/GitRepository.interface.mjs";

let tmpDir = "";

beforeAll(async () => {
  tmpDir = mkdtempSync(path.join(tmpdir(), "testRun-"));
  const git = simpleGit(tmpDir, {});
  await git.clone("https://github.com/ONCE-DAO/testrepo.git");
});

describe("When initializing a git repository", () => {
  test("remote url and current branch have to be detected", async () => {
    const testRepoPath = join(tmpDir, "testRepo");
    const repo = await DefaultGitRepository.init({ baseDir: testRepoPath });
    expect(repo.remoteUrl).toBe("https://github.com/ONCE-DAO/testrepo.git");
    expect(repo.currentBranch).toBe("main");
  });

  test("exception have to be thrown when folder is not a git repository", async () => {
    const noRepoPath = join(tmpDir, "noRepo");
    mkdirSync(noRepoPath);

    const initFn = async () =>
      await DefaultGitRepository.init({ baseDir: noRepoPath });

    await expect(initFn()).rejects.toThrow(NotAGitRepositoryError);
  });

  test("remote url and current branch have to be detected", async () => {
    const repo = await DefaultGitRepository.init({ baseDir: process.cwd() });
    // expect(repo.remoteUrl).toBe("https://github.com/ONCE-DAO/testrepo.git");
    // expect(repo.currentBranch).toBe("main");
    const f = await repo.getSubmodules(DefaultSubmodule.initSubmodule);
    console.log(f);
  });
});

afterAll(() => {
  tmpDir !== "" && rmSync(tmpDir, { recursive: true, force: true });
});
