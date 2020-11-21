import VLC_client from "./VLC_client.js";
import Helper from "./Helper.js";
import { seriesData, seriesMeta } from "./types.js";
import Tracker from "./Tracker.js";

const vlc: VLC_client = new VLC_client();
const tracker: Tracker = new Tracker();

vlc.on("statuschange", async (prevStatus: any = null, status: any = null) => {
	if (!(await Helper.canContinue(vlc.justStarted, prevStatus, status))) return;

	const formattedMeta = await Helper.tryFormat(status.information.category.meta);
	if (!formattedMeta) return;

	const series = await tracker.fetch();
	if (!series) return;

	tracker.consume(formattedMeta as seriesMeta, series as seriesData[]);
});
