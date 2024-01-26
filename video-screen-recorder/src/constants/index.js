export const VIDEO = "video";
export const SCREEN = "screen";
export const VIDEO_STREAM_CONSTRAINTS = {
  video: true,
  audio: true,
};
export const SCREEN_RECORDING_CONSTRAINTS = {
  video: { mediaSource: "screen" },
  audio: true,
};
export const VIDEO_BLOB_TYPE = "video/mp4";
export const SCREEN_RECORDING_BLOB_TYPE = "video/webm";
