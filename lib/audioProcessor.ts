import { AudioProcessingOptions } from '../types';

export class AudioProcessor {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } else {
      console.warn('AudioContext is not available on the server.');
    }
  }

  async processAudio(file: File, options: AudioProcessingOptions): Promise<Blob> {
    if (!this.audioContext) {
      throw new Error('AudioContext is not initialized.');
    }
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const editedBuffer = this.editAudioBuffer(audioBuffer, options);
      const wavBlob = await this.bufferToWave(editedBuffer);
      return this.convertFormat(wavBlob, options.outputFormat);
    } catch (error) {
      console.error('Error processing audio:', error);
      throw new Error('Failed to process audio');
    }
  }

  private editAudioBuffer(buffer: AudioBuffer, options: AudioProcessingOptions): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('AudioContext is not initialized.');
    }

    const { startTime, endTime, fadeInDuration, fadeOutDuration } = options;
    const sampleRate = buffer.sampleRate;
    const channels = buffer.numberOfChannels;

    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const newLength = endSample - startSample;

    const newBuffer = this.audioContext.createBuffer(channels, newLength, sampleRate);

    for (let channel = 0; channel < channels; channel++) {
      const oldData = buffer.getChannelData(channel);
      const newData = newBuffer.getChannelData(channel);

      for (let i = 0; i < newLength; i++) {
        newData[i] = oldData[i + startSample];
      }

      // Apply fade in
      const fadeInSamples = Math.floor(fadeInDuration * sampleRate);
      for (let i = 0; i < fadeInSamples; i++) {
        newData[i] *= i / fadeInSamples;
      }

      // Apply fade out
      const fadeOutSamples = Math.floor(fadeOutDuration * sampleRate);
      for (let i = 0; i < fadeOutSamples; i++) {
        newData[newLength - 1 - i] *= i / fadeOutSamples;
      }
    }

    return newBuffer;
  }

  private async bufferToWave(buffer: AudioBuffer): Promise<Blob> {
    if (!this.audioContext) {
      throw new Error('AudioContext is not initialized.');
    }

    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels: Float32Array[] = [];
    let offset = 0;
    let pos = 0;

    // Write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // avg. bytes/sec
    setUint16(buffer.numberOfChannels * 2); // block-align
    setUint16(16); // 16-bit
    setUint32(0x61746164); // "data" chunk
    setUint32(length - pos - 4); // chunk length

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });

    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  private async convertFormat(wavBlob: Blob, outputFormat: string): Promise<Blob> {
    if (outputFormat === 'wav') {
      return wavBlob;
    }

    // For MP3 and OGG, we'd typically use a library like lamejs or oggenc.js
    // However, for simplicity, we'll just return the WAV blob with a warning
    console.warn(`Output format ${outputFormat} is not supported. Returning WAV format.`);
    return wavBlob;
  }
}

export const audioProcessor = new AudioProcessor();
