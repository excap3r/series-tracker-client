class Helper {
    static isValidStatus(status) {
        return new Promise((resolve) => {
            if (typeof status === "undefined" ||
                typeof status.information === "undefined" ||
                typeof status.information.category === "undefined" ||
                typeof status.information.category.meta === "undefined") {
                return resolve(false);
            }
            return resolve(true);
        });
    }
    static canContinue(justStarted, prevStatus, status) {
        return new Promise(async (resolve) => {
            let output = false;
            if (!(await this.isValidStatus(status)))
                output = false;
            else if (justStarted)
                output = true;
            else if (!(await this.isValidStatus(prevStatus)))
                output = true;
            else if (prevStatus.information.category.meta.filename !== status.information.category.meta.filename)
                output = true;
            resolve(output);
        });
    }
    static tryFormat(meta) {
        return new Promise(async (resolve) => {
            if (!meta.showName && (meta.title || meta.filename))
                meta.showName = await extractMeta(meta.title || meta.filename);
            if (!meta.showName)
                return resolve(false);
            const result = {
                title: meta.showName,
                series_number: meta.seasonNumber,
                episode_number: meta.episodeNumber,
            };
            return resolve(result);
        });
        function extractMeta(title) {
            return new Promise((resolve) => {
                const clearFilename = /.mkv|.mp4|.mp3|.avi|.wmv|.flv|.3gp/g;
                const clearSymbols = /[^a-zA-Z0-9ÁÉĚÍÝÓÚŮŽŠČŘĎŤŇĹáéěíýóúůžščřďťĺňs]/g;
                const reduceSpaces = /\s\s+/g;
                title = title.replace(clearFilename, "");
                title = title.replace(clearSymbols, " ");
                title = title.replace(reduceSpaces, " ").trim();
                if (!meta.seasonNumber || !meta.episodeNumber) {
                    const seRegex = /^[A-z\s]+(S\d+E\d+|S\d+xE\d+|\d+x\d+)$/gi;
                    const onlyNumsRegex = /[^\d]/g;
                    const regTest = seRegex.test(title);
                    const chosenRegex = regTest ? seRegex : false;
                    if (!chosenRegex)
                        return resolve(false);
                    chosenRegex.lastIndex = 0;
                    let SeasonAndEpisode = chosenRegex.exec(title);
                    if (!SeasonAndEpisode)
                        return resolve(false);
                    SeasonAndEpisode = SeasonAndEpisode[0].split(/[ex]/gi);
                    SeasonAndEpisode = SeasonAndEpisode.filter((element) => element.length);
                    let season = SeasonAndEpisode[0].replace(onlyNumsRegex, "");
                    let episode = SeasonAndEpisode[1].replace(onlyNumsRegex, "");
                    if (!meta.seasonNumber)
                        meta.seasonNumber = season;
                    if (!meta.episodeNumber)
                        meta.episodeNumber = episode;
                    const cleanTitle = seRegex ? /(S\d+E\d+.*)|(S\d+xE\d+.*)/gi : /(\d+x\d+.*)/gi;
                    title = title.replace(cleanTitle, "").trim();
                }
                return resolve(title);
            });
        }
    }
    static extractMeta(series) {
        let filteredSeries = [];
        return new Promise((resolve) => {
            series.forEach((object) => {
                object.title.rendered = object.title.rendered.replace("Private: ", "");
                filteredSeries.push({
                    id: object.id,
                    title: object.title.rendered,
                    series_number: object.series_number,
                    episode_number: object.episode_number,
                });
            });
            return resolve(filteredSeries);
        });
    }
    static normalizeStr(text) {
        return new Promise((resolve) => {
            return resolve(text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        });
    }
}
export default Helper;
