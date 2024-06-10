export type MetadataFilterOptions<Metadata extends Object = any> = {
  [K in keyof Metadata]?: Metadata[K];
};
