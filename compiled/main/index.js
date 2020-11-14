import VLC_client from "./VLC_client.js";
import Helper from "./Helper.js";
import Tracker from "./Tracker.js";
const vlc = new VLC_client();
const tracker = new Tracker();
vlc.on("statuschange", async (prevStatus = null, status = null) => {
    if (!(await Helper.canContinue(vlc.justStarted, prevStatus, status)))
        return;
    const formattedMeta = await Helper.tryFormat(status.information.category.meta);
    if (!formattedMeta)
        return;
    const series = await tracker.fetch();
    if (!series)
        return;
    tracker.consume(formattedMeta, series);
});
