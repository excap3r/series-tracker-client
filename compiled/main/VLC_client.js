import { VLC } from "node-vlc-http";
import config from "../config/config.js";
class VLC_client extends VLC {
    constructor() {
        let exportConfig = {
            username: "",
            password: config.vlc.password,
            host: config.vlc.host,
            port: parseInt(config.vlc.port),
            triesInterval: config.vlc.refreshMs,
            tickLengthMs: config.vlc.refreshMs,
        };
        super(exportConfig);
        this.justStarted = true;
        this.events();
        this.log("started");
    }
    events() {
        super.on("connect", () => this.log("Succesfully connected."));
        super.on("error", (err) => {
            if (err.message.includes("ECONNREFUSED"))
                return;
            this.log(`Error: ${err.message}`);
        });
    }
    log(message) {
        console.log(`VLC | ${message}`);
    }
}
export default VLC_client;
