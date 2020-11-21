import { seriesData, seriesMeta } from "./types.js";

class Helper {
	public static isValidStatus(status: any): Promise<boolean> {
		return new Promise((resolve) => {
			if (
				typeof status === "undefined" ||
				typeof status.information === "undefined" ||
				typeof status.information.category === "undefined" ||
				typeof status.information.category.meta === "undefined"
			) {
				return resolve(false);
			}

			return resolve(true);
		});
	}

	public static canContinue(justStarted: boolean, prevStatus: any, status: any): Promise<boolean> {
		return new Promise(async (resolve) => {
			let output: boolean = false;

			if (!(await this.isValidStatus(status))) output = false;
			else if (justStarted) output = true;
			else if (!(await this.isValidStatus(prevStatus))) output = true;
			else if (prevStatus.information.category.meta.filename !== status.information.category.meta.filename) output = true;

			resolve(output);
		});
	}

	public static tryFormat(meta: any): Promise<seriesMeta | boolean> {
		return new Promise(async (resolve) => {
			if (!meta.showName && (meta.title || meta.filename)) meta.showName = await extractMeta(meta.title || meta.filename);

			if (!meta.showName) return resolve(false);

			const result = {
				title: meta.showName,
				series_number: meta.seasonNumber,
				episode_number: meta.episodeNumber,
			};

			return resolve(result);
		});

		function extractMeta(title: string) {
			return new Promise((resolve) => {
				const clearFilename: RegExp = /.mkv|.mp4|.mp3|.avi|.wmv|.flv|.3gp/g;
				const clearSymbols: RegExp = /[^a-zA-Z0-9ÁÉĚÍÝÓÚŮŽŠČŘĎŤŇĹáéěíýóúůžščřďťĺňs]/g;
				const reduceSpaces: RegExp = /\s\s+/g;

				title = title.replace(clearFilename, "");
				title = title.replace(clearSymbols, " ");
				title = title.replace(reduceSpaces, " ").trim();

				if (!meta.seasonNumber || !meta.episodeNumber) {
					// s = season, e = episode
					const seRegex: RegExp = /^[A-z\s]+(S\d+E\d+|S\d+xE\d+|\d+x\d+)$/gi;
					const onlyNumsRegex: RegExp = /[^\d]/g;

					const regTest: boolean = seRegex.test(title);

					const chosenRegex: RegExp | boolean = regTest ? seRegex : false;

					if (!chosenRegex) return resolve(false);

					chosenRegex.lastIndex = 0;

					let SeasonAndEpisode: String[] | RegExpExecArray | null = chosenRegex.exec(title);

					if (!SeasonAndEpisode) return resolve(false);

					SeasonAndEpisode = SeasonAndEpisode[0].split(/[ex]/gi);

					SeasonAndEpisode = SeasonAndEpisode.filter((element) => element.length);

					let season: string = SeasonAndEpisode[0].replace(onlyNumsRegex, "");
					let episode: string = SeasonAndEpisode[1].replace(onlyNumsRegex, "");

					if (!meta.seasonNumber) meta.seasonNumber = season;
					if (!meta.episodeNumber) meta.episodeNumber = episode;

					const cleanTitle = seRegex ? /(S\d+E\d+.*)|(S\d+xE\d+.*)/gi : /(\d+x\d+.*)/gi;

					title = title.replace(cleanTitle, "").trim();
				}
				return resolve(title);
			});
		}
	}

	public static extractMeta(series: any): Promise<seriesData[]> {
		let filteredSeries: seriesData[] = [];

		return new Promise((resolve) => {
			series.forEach((object: any) => {
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

	public static normalizeStr(text: string): Promise<string> {
		return new Promise((resolve) => {
			return resolve(text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
		});
	}
}

export default Helper;
