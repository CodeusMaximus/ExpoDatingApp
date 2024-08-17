import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

interface SplashScreenComponentProps {
  onFinish: () => void;
}

const SplashScreenComponent: React.FC<SplashScreenComponentProps> = ({ onFinish }) => {
  const video = useRef<Video>(null);

  useEffect(() => {
    const checkIfFinished = async () => {
      if (video.current) {
        const status = await video.current.getStatusAsync();
        if (status.isLoaded && !status.isLooping && 'didJustFinish' in status && status.didJustFinish) {
          onFinish();
        }
      }
    };

    const interval = setInterval(checkIfFinished, 1000);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../assets/splash.mp4')}
        style={styles.video}
        shouldPlay
        isLooping={false}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
          if (status.isLoaded && !status.isLooping && 'didJustFinish' in status && status.didJustFinish) {
            onFinish();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreenComponent;
