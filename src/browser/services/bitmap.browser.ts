import { Incident } from "incident";
import { Sint32, Uint8 } from "semantic-types";
import * as zlib from "zlib";
import { BitmapService } from "../../lib/services/bitmap";

export class BrowserBitmapService implements BitmapService {
  async decodeJpeg(data: Uint8Array, fixJpeg: boolean): Promise<ImageData> {
    return decodeStandardFormat(data, "image/jpeg");
  }

  async decodeAjpeg(data: Uint8Array, fixJpeg: boolean): Promise<ImageData> {
    const byteCount: number = data.length;
    // dataSize: Uint32LE
    const dataSize: number = (data[3] * (1 << 24)) + (data[2] << 16) + (data[1] << 8) + data[0];
    const jpegData: Uint8Array = data.subarray(4, 4 + dataSize);
    const compressedAlphaData: Uint8Array = data.subarray(4 + dataSize);
    const [imageData, alphaData] = await Promise.all([
      // TODO: Fix JPEG data?
      decodeStandardFormat(jpegData, "image/jpeg"),
      zlibInflate(compressedAlphaData),
    ]);
    straightRgbaFromAlphaMask(imageData.data.buffer, alphaData);
    return imageData;
  }

  async decodePng(data: Uint8Array): Promise<ImageData> {
    return decodeStandardFormat(data, "image/png");
  }

  async decodeGif(data: Uint8Array): Promise<ImageData> {
    return decodeStandardFormat(data, "image/gif");
  }
}

async function decodeStandardFormat(
  data: Uint8Array,
  mediaType: "image/jpeg" | "image/gif" | "image/png",
): Promise<ImageData> {
  return new Promise<ImageData>((resolve, reject) => {
    const image: HTMLImageElement = new Image();
    // TODO: Use addEventListener and remove events once one of them is triggered
    image.onload = function (event: Event): void {
      try {
        resolve(getImageData(image));
      } catch (err) {
        reject(new Incident(err, "GetImageDataError"));
      }
    };
    image.onerror = function (event: ErrorEvent): void {
      reject(new Incident("LoadImageError", {event}));
    };
    image.src = URL.createObjectURL(new Blob([data], {type: mediaType}));
  });
}

function getImageData(image: HTMLImageElement): ImageData {
  const {width, height} = image;
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.height = height;
  canvas.width = width;
  const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (context === null) {
    throw new Incident("CannotCreateCanvasRenderingContext2D");
  }
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, width, height);
}

async function zlibInflate(compressed: Uint8Array): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const buffer: Buffer = Buffer.from(compressed as Buffer);
    zlib.inflate(buffer, (error: Error | null, result: Buffer) => {
      if (error !== null) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Create a straight RGBA buffer by combining a opaque RGBA buffer with an alpha mask.
 *
 * @param opaqueSource Buffer of opaque 8-bit RGBA (alpha channel is 255)
 * @param alphaMask Buffer of 8-bit opacity values
 */
function straightRgbaFromAlphaMask(opaqueSource: ArrayBuffer | SharedArrayBuffer, alphaMask: Uint8Array): void {
  const pixelCount: number = alphaMask.length;
  if (process.env["NODE_ENV"] !== "production") {
    if (opaqueSource.byteLength !== 4 * pixelCount) {
      throw new Incident("IncompatibleAlphaMask", "Alpha mask and image data are incompatible");
    }
  }
  const sourceView: DataView = new DataView(opaqueSource);
  for (let i: number = 0; i < pixelCount; i++) {
    sourceView.setInt32(
      4 * i,
      (sourceView.getInt32(4 * i, true) & 0x00ffffff) | (alphaMask[i] << 24),
      true,
    );
  }
}

/**
 * Converts a straight 8-bit ARGB to a premultiplied 8-bit ARGB
 */
function premultiplyStraightArgb(sArgb: Sint32): Sint32 {
  const a: Uint8 = (sArgb >>> 24) & 0xff;
  let b: Uint8 = (sArgb >>> 0) & 0xff;
  let g: Uint8 = (sArgb >>> 8) & 0xff;
  let r: Uint8 = (sArgb >>> 16) & 0xff;
  // TODO: Compare perf with Math.trunc?
  // `+127/255` is `0.5`: round to nearest
  b = ((Math.imul(b, a) + 127) / 255) | 0;
  g = ((Math.imul(g, a) + 127) / 255) | 0;
  r = ((Math.imul(r, a) + 127) / 255) | 0;
  return a << 24 | r << 16 | g << 8 | b;
}

/**
 * Create a premultiplied RGBA buffer by combining a opaque RGBA buffer with an alpha mask.
 *
 * @param opaqueSource Buffer of opaque 8-bit RGBA (alpha channel is 255)
 * @param alphaMask Buffer of 8-bit opacity values
 */
function premultipliedRgbaFromAlphaMask(opaqueSource: ArrayBuffer | SharedArrayBuffer, alphaMask: Uint8Array): void {
  const pixelCount: number = alphaMask.length;
  if (process.env["NODE_ENV"] !== "production") {
    if (opaqueSource.byteLength !== 4 * pixelCount) {
      throw new Incident("IncompatibleAlphaMask", "Alpha mask and image data are incompatible");
    }
  }
  const sourceView: DataView = new DataView(opaqueSource);
  for (let i: number = 0; i < pixelCount; i++) {
    const maskValue: Uint8 = alphaMask[i];
    if (maskValue === 0x00) {
      sourceView.setInt32(4 * i, 0, true);
      continue;
    } else if (maskValue === 0xff) {
      continue;
    }
    const sourceArgb: Sint32 = sourceView.getInt32(4 * i, true);
    sourceView.setInt32(
      4 * i,
      premultiplyStraightArgb((sourceArgb & 0x00ffffff) | (maskValue << 24)),
      true,
    );
  }
}
