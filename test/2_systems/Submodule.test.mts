import { DefaultGitRepository } from "../../src/2_systems/GitRepository.class.mjs";
import DefaultSubmodule from "../../src/2_systems/Submodule.class.mjs";

describe("Submodules", () => {

    test("Build ONCE", async () => {
        DefaultGitRepository;
        const repo = await DefaultGitRepository.init({ baseDir: process.cwd() });
        const subs = await repo.getSubmodules(DefaultSubmodule.initSubmodule);

        let onceSub = subs.filter(sub => sub.name === 'once.merge')[0];
        expect(onceSub).toBeTruthy();

        await onceSub.build();
    });
});