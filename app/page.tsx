import { Title, Text, Container, Paper } from '@mantine/core';
import AudioCutter from '../components/AudioCutter';

export default function Home() {
  return (
    <Container size="md" py="xl">
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Title order={1} className='align-items:center' mb="md">
          Welcome to Audio Cutter
        </Title>
        <Text className='align-items:center' mb="xl" size="lg">
          Edit your audio files with ease using our powerful and intuitive tools.
        </Text>
        <AudioCutter />
      </Paper>
    </Container>
  );
}
