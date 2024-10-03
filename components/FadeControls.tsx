import { Slider, Text, Stack } from '@mantine/core';

interface FadeControlsProps {
  fadeInDuration: number;
  fadeOutDuration: number;
  onFadeInChange: (value: number) => void;
  onFadeOutChange: (value: number) => void;
}

export default function FadeControls({
  fadeInDuration,
  fadeOutDuration,
  onFadeInChange,
  onFadeOutChange,
}: FadeControlsProps) {
  return (
    <Stack className='spacing-xs'>
      <Text>Fade In Duration</Text>
      <Slider
        min={0}
        max={10}
        label={(value) => `${value}s`}
        value={fadeInDuration}
        onChange={onFadeInChange}
      />
      <Text>Fade Out Duration</Text>
      <Slider
        min={0}
        max={10}
        label={(value) => `${value}s`}
        value={fadeOutDuration}
        onChange={onFadeOutChange}
      />
    </Stack>
  );
}