import { mkdirSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import * as path from "path";
import { join } from "path";
import simpleGit from "simple-git";
import { DefaultGitRepository } from "../../src/2_systems/GitRepository.class.mjs";
import DefaultSubmodule from "../../src/2_systems/Submodule.class.mjs";
import { NotAGitRepositoryError } from "../../src/3_services/GitRepository.interface.mjs";

let tmpDir = "";

const repoName = "testdata-repository"
const repoUrl = `https://github.com/ONCE-DAO/${repoName}.git`

beforeAll(async () => {
  tmpDir = mkdtempSync(path.join(tmpdir(), "testRun-"));
  const git = simpleGit(tmpDir, {});
  await git.clone(repoUrl);
});

describe("When initializing a git repository", () => {
  test("remote url and current branch have to be detected", async () => {
    const testRepoPath = join(tmpDir, repoName);
    const repo = await DefaultGitRepository.init({ baseDir: testRepoPath });
    expect(repo.remoteUrl).toBe(repoUrl);
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
    const testRepoPath = join(tmpDir, repoName);
    const repo = await DefaultGitRepository.init({ baseDir: testRepoPath });
    repo.updateSubmodules();
    const submodules = await repo.getSubmodules(DefaultSubmodule.initSubmodule);
    expect(submodules.length).toBe(1)
  });
});

afterAll(() => {
  tmpDir !== "" && rmSync(tmpDir, { recursive: true, force: true });
});
