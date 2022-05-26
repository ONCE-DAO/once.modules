import DefaultGitRepository from "../../../../dist/once.modules/main/2_systems/GitRepository.class.mjs";

test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});

test("adds 1 + 2 to equal 3", async () => {
  console.log("CWD", process.cwd());
//   throw process.cwd()
  await DefaultGitRepository.init({ baseDir: process.cwd() });
  expect(1 + 2).toBe(3);
});
