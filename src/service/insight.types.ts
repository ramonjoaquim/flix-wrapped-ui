export type InsightType =
  | "MOST_WATCHED_TYPE"
  | "MOST_WATCHED_BY_YEAR"
  | "MOST_WATCHED_SERIES"
  | "LAST_WATCHED";

export interface InsightResponse {
  insightType: InsightType;
  message: string;
  data: InsightData;
}

export type InsightData =
  | MostWatchedTypeData
  | MostWatchedByYearData
  | MostWatchedSeriesData
  | LastWatchedData;

export interface MostWatchedTypeData {
  movies: number;
  series: number;
}

export interface YearlyInsight {
  year: number;
  moviesCount: number;
  episodesCount: number;
  moviesTitles: string[];
  seriesTitles: string[];
}

export interface MostWatchedByYearData {
  yearlyData: YearlyInsight[];
}

export interface TopSeriesItem {
  title: string;
  episodesCount: number;
  urlPoster: string;
}

export interface MostWatchedSeriesData {
  topSeries: TopSeriesItem[];
}

export interface ContentItem {
  title: string;
  type: string;
  dateWatched: string;
  urlPoster: string;
}

export interface LastWatchedData {
  contentDetails: ContentItem[];
}
