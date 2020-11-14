import { VLC, VLCOptions } from "node-vlc-http";
import config from "../config/config.js";

class VLC_client extends VLC {
	public justStarted: boolean;

	constructor() {
		let exportConfig: VLCOptions = {
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

	private events(): void {
		super.on("connect", () => this.log("Succesfully connected."));

		super.on("error", (err: Error) => {
			// reduction of spam if VLC is not running
			if (err.message.includes("ECONNREFUSED")) return;

			this.log(`Error: ${err.message}`);
		});
	}

	private log(message: string): void {
		console.log(`VLC | ${message}`);
	}
}

export default VLC_client;
