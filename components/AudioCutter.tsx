'use client';
import { useState, useCallback } from 'react';
import { Button, Stack, Text, Container, Paper, Group, Loader } from '@mantine/core';
import AudioUploader from './AudioUploader';
import CutRangeSlider from './CutRangeSilder';
import FadeControls from './FadeControls';
import FormatSelector from './FormatSelector';
import { AudioFile, AudioProcessingOptions } from '../types';
import { audioProcessor } from '../lib/audioProcessor';

export default function AudioCutter() {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(100);
  const [fadeInDuration, setFadeInDuration] = useState(0);
  const [fadeOutDuration, setFadeOutDuration] = useState(0);
  const [outputFormat, setOutputFormat] = useState('wav');
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = useCallback((file: AudioFile | null) => {
    setAudioFile(file);
    if (file) {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setEndTime(audio.duration);
      };
    }
  }, []);

  const handleEdit = useCallback(async () => {
    if (!audioFile) return;

    setIsProcessing(true);

    try {
      const options: AudioProcessingOptions = {
        startTime,
        endTime,
        fadeInDuration,
        fadeOutDuration,
        outputFormat,
      };

      const processedAudio = await audioProcessor.processAudio(audioFile, options);

      const url = URL.createObjectURL(processedAudio);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `edited_audio.${outputFormat}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error processing audio:', error);
      // Here you could show an error message to the user
    } finally {
      setIsProcessing(false);
    }
  }, [audioFile, startTime, endTime, fadeInDuration, fadeOutDuration, outputFormat]);

  const handleDelete = useCallback(() => {
    setAudioFile(null);
    setStartTime(0);
    setEndTime(100);
    setFadeInDuration(0);
    setFadeOutDuration(0);
    setDuration(0);
  }, []);

  return (
    <Container size="sm" px="sm">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Stack className='spacing-md'>
          <AudioUploader onFileUpload={handleFileUpload} audioFile={audioFile} />
          {audioFile && (
            <>
              <Text className='text-w-500' size="lg">
                Audio Duration: {duration.toFixed(2)} seconds
              </Text>
              <CutRangeSlider
                startTime={startTime}
                endTime={endTime}
                onRangeChange={(start, end) => {
                  setStartTime(start);
                  setEndTime(end);
                }}
              />
              <FadeControls
                fadeInDuration={fadeInDuration}
                fadeOutDuration={fadeOutDuration}
                onFadeInChange={setFadeInDuration}
                onFadeOutChange={setFadeOutDuration}
              />
              <FormatSelector format={outputFormat} onFormatChange={setOutputFormat} />
              <Group className='position-apart' mt="lg">
                <Button onClick={handleEdit} disabled={isProcessing} fullWidth>
                  {isProcessing ? <Loader size="xs" /> : 'Edit and Save'}
                </Button>
                <Button onClick={handleDelete} color="red" disabled={isProcessing} fullWidth>
                  Delete
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}