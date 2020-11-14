import WPAPI, { WPAPIOptions, WPRequest, WPRequestFactory } from "wpapi";
import { addArgs, routeOptions, seriesData, seriesMeta, updateArgs } from "./interfaces.js";
import Helper from "./Helper.js";
import config from "../config/config.js";

class Tracker extends WPAPI {
	private series: WPRequestFactory;

	constructor() {
		let options: WPAPIOptions;

		options = {
			endpoint: "http://localhost/series-tracker/wp-json",
			username: config.tracker.username,
			password: config.tracker.password,
		};

		super(options);

		// register series route
		const seriesRouteOptions: routeOptions = {
			namespace: "wp/v2",
			restbase: "/series/(?P<id>\\d+)",
		};

		this.series = super.registerRoute(seriesRouteOptions.namespace, seriesRouteOptions.restbase);

		this.log("started");
	}

	public add(args: addArgs): void {
		if (!args.status) args.status = "publish";

		this.series()
			.create(args)
			.then(() => this.log(`Added "${args.title}" to tracking.`))
			.catch((err) => this.log(`${err.code || err.name || err}`));
	}

	public update(args: updateArgs): void {
		if (!args.status) args.status = "publish";

		this.series()
			.id(args.id)
			.update(args)
			.then(() => this.log(`Updated "${args.title}".`))
			.catch((err) => this.log(`${err.code || err.name || err}`));
	}

	public fetch(): Promise<seriesData[] | boolean> {
		return new Promise(async (resolve, reject) => {
			this.series()
				.param("status", "any")
				.then(async (series: WPRequest) => {
					const result = await Helper.extractMeta(series);
					return resolve(result);
				})
				.catch((err) => {
					this.log(`${err.code || err.name || err}`);
					return resolve(false);
				});
		});
	}

	public async consume(meta: seriesMeta, series: seriesData[]): Promise<void> {
		let upToDate: boolean = true;
		let result: seriesData | boolean = false;

		const metaTitle: string = await Helper.normalizeStr(meta.title);

		for (let i = 0; i < series.length - 1; i++) {
			const title: string = (await Helper.normalizeStr(series[i].title)).toLowerCase();

			if (title == metaTitle.toLowerCase()) {
				if (meta.series_number != series[i].series_number) upToDate = false;
				else if (meta.episode_number != series[i].episode_number) upToDate = false;

				result = series[i];
				result.episode_number = meta.episode_number;
				result.series_number = meta.series_number;

				break;
			}
		}

		if (!result) return this.add(meta);

		if (!upToDate) return this.update(result);
	}

	private log(message: string): void {
		console.log(`Tracker | ${message}`);
	}
}

export default Tracker;
