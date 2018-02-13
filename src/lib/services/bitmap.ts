export interface BitmapService {
  decodeJpeg(data: Uint8Array, fixJpeg: boolean): Promise<ImageData>;

  decodePng(data: Uint8Array): Promise<ImageData>;

  decodeGif(data: Uint8Array): Promise<ImageData>;

  decodeAjpeg(data: Uint8Array, fixJpeg: boolean): Promise<ImageData>;
}
