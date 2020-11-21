/** Series data fetched from request and filtered */
export type seriesData = {
	id: number;
	title: string;
	series_number: string;
	episode_number: string;
}

/** Series meta filtered */
export type seriesMeta = {
	title: string;
	series_number: string;
	episode_number: string;
}

/** WPAPI Custom Route Options */
export type routeOptions = {
	/** Name-space of route, e.g. 'wp/v2'" */
	namespace: string;
	/** Rest-base of route, e.g. '/series/(?P<id>\\d+)' */
	restbase: string;
}

/** Arguments for add method of Tracker */
export type addArgs = {
	title: string;
	series_number: string;
	episode_number: string;
	status?: string;
}

/** Arguments for update method of Tracker */
export type updateArgs = {
	id: number;
	title: string;
	series_number: string;
	episode_number: string;
	status?: string;
}
