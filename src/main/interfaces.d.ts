/** Series data fetched from request and filtered */
export interface seriesData {
	id: number;
	title: string;
	series_number: string;
	episode_number: string;
}

/** Series meta filtered */
export interface seriesMeta {
	title: string;
	series_number: string;
	episode_number: string;
}

/** WPAPI Custom Route Options */
export interface routeOptions {
	/** Name-space of route, e.g. 'wp/v2'" */
	namespace: string;
	/** Rest-base of route, e.g. '/series/(?P<id>\\d+)' */
	restbase: string;
}

/** Arguments for add method of Tracker */
export interface addArgs {
	title: string;
	series_number: string;
	episode_number: string;
	status?: string;
}

/** Arguments for update method of Tracker */
export interface updateArgs {
	id: number;
	title: string;
	series_number: string;
	episode_number: string;
	status?: string;
}
