import { Select } from '@mantine/core';

interface FormatSelectorProps {
  format: string;
  onFormatChange: (format: string) => void;
}

export default function FormatSelector({ format, onFormatChange }: FormatSelectorProps) {
  return (
    <Select
      label="Output Format"
      placeholder="Select format"
      data={[
        { value: 'mp3', label: 'MP3' },
        { value: 'wav', label: 'WAV' },
        { value: 'ogg', label: 'OGG' },
      ]}
      value={format}
      onChange={(value) => onFormatChange(value as string)}
    />
  );
}