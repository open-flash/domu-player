import { AudioCodingFormat } from "swf-tree/sound/audio-coding-format";
import { DefineSound } from "swf-tree/tags";

interface Sound {
  tag: DefineSound;
  audioBuffer$: Promise<AudioBuffer>;
}

export class SwfAudioContext {
  private readonly webAudioContext: AudioContext;
  private readonly sounds: Map<number, Sound>;

  constructor() {
    this.webAudioContext = new AudioContext();
    this.sounds = new Map();
  }

  addSound(tag: DefineSound): number {
    // TODO: Do not use the tag id to identify this sound? (to handle duplicate tag ids)
    const id: number = tag.id;

    if (tag.format !== AudioCodingFormat.Mp3) {
      throw new Error("NotImplemented: support for non-mp3 sources");
    }

    // TODO: Understand why mp3 data is padded with two extra bytes
    // (I am not sure what's going on, if you skip the first two bytes it works)
    const mp3Bytes: Uint8Array = tag.data.subarray(2);
    // Copy to a native array buffer
    // TODO: Check how to use the uint8array buffer directly
    const mp3Buffer: ArrayBuffer = new ArrayBuffer(mp3Bytes.length);
    const mp3View: DataView = new DataView(mp3Buffer);
    for (const [i, x] of mp3Bytes.entries()) {
      mp3View.setUint8(i, x);
    }

    const audioBuffer$: Promise<AudioBuffer> = this.webAudioContext.decodeAudioData(mp3Buffer);

    const sound: Sound = {
      tag,
      audioBuffer$,
    };

    this.sounds.set(id, sound);

    return id;
  }

  startSound(id: number): void {
    const sound: Sound | undefined = this.sounds.get(id);
    if (sound === undefined) {
      console.warn(`SoundNotFound: ${id}`);
      return;
    }

    (async () => {
      const audioBuffer: AudioBuffer = await sound.audioBuffer$;
      const srcNode: AudioBufferSourceNode = this.webAudioContext.createBufferSource();
      srcNode.buffer = audioBuffer;
      srcNode.connect(this.webAudioContext.destination);
      srcNode.start(0);
    })();
  }
}
