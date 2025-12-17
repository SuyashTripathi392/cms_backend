// utils/getVideoDuration.js
import { getVideoDurationInSeconds } from "get-video-duration";
import { Readable } from "stream";

export const getVideoDuration = async (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const duration = await getVideoDurationInSeconds(stream);
  return Math.floor(duration); // round to nearest second
};