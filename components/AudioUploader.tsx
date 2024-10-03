import { FileInput, Stack, Text } from '@mantine/core';
import { AudioFile } from '../types';

interface AudioUploaderProps {
  onFileUpload: (file: AudioFile | null) => void;
  audioFile: AudioFile | null;
}

export default function AudioUploader({ onFileUpload, audioFile }: AudioUploaderProps) {
  return (
    <Stack className='spacing-sm'>
      <Text size="sm" className='text-w-500'>
        Upload your audio file:
      </Text>
      <FileInput
        placeholder="Select or drag audio file here"
        accept="audio/*"
        value={audioFile}
        onChange={onFileUpload}
        withAsterisk
      />
      {audioFile && (
        <Text size="xs" color="dimmed">
          Selected file: {audioFile.name}
        </Text>
      )}
    </Stack>
  );
}
