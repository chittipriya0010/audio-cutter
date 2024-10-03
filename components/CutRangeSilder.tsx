import { RangeSlider, Text } from '@mantine/core';

interface CutRangeSliderProps {
  startTime: number;
  endTime: number;
  onRangeChange: (start: number, end: number) => void;
}

export default function CutRangeSlider({ startTime, endTime, onRangeChange }: CutRangeSliderProps) {
  return (
    <>
      <Text>Cut Range</Text>
      <RangeSlider
        min={0}
        max={100}
        label={(value) => `${value}s`}
        value={[startTime, endTime]}
        onChange={([start, end]) => onRangeChange(start, end)}
      />
    </>
  );
}