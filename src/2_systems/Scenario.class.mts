import { join } from "path";
import EAMD from "../3_services/EAMD.interface.mjs";
import Scenario from "../3_services/Scenario.interface.mjs";

export default class DefaultScenario implements Scenario {
    name: string;
    private eamd: EAMD;

    constructor(eamd: EAMD, name = "localhost") {
        this.eamd = eamd
        this.name = name
    }

    get path(): string {
        return join(this.eamd.folderPath, this.name)
    }

}