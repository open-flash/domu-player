export interface AudioService {
  decodeMp3(bytes: Uint8Array, startsWithPadding: boolean): Promise<AudioBuffer>;
}
