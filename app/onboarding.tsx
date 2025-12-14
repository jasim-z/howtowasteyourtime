import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { CloudMoon, Clock, Sparkles, X, ArrowRight } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/ThemeContext';
import { Button } from '@/components/Button';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = 'has_seen_onboarding';

interface OnboardingScreen {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
}

const screens: OnboardingScreen[] = [
  {
    icon: CloudMoon,
    title: 'Welcome to wasting time',
    subtitle: 'Finally, an app that asks nothing of you.',
  },
  {
    icon: Clock,
    title: 'Pick an activity. Start the timer.',
    subtitle: '5 minutes of guilt-free nothing. That\'s it.',
  },
  {
    icon: Sparkles,
    title: 'No guilt. That\'s the rule.',
    subtitle: 'You\'re allowed to do nothing. This app is proof.',
  },
];

function DotIndicator({ isActive, colors }: { isActive: boolean; colors: any }) {
  const dotWidth = useSharedValue(isActive ? 24 : 8);

  React.useEffect(() => {
    dotWidth.value = withSpring(isActive ? 24 : 8, { damping: 15 });
  }, [isActive]);

  const dotAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: dotWidth.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          backgroundColor: isActive ? colors.primary : colors.textLight + '60',
        },
        dotAnimatedStyle,
      ]}
    />
  );
}

function DotIndicators({ currentPage, totalScreens, colors }: { currentPage: number; totalScreens: number; colors: any }) {
  return (
    <View className="flex-row justify-center items-center gap-2 mb-8">
      {Array.from({ length: totalScreens }, (_, index) => (
        <DotIndicator key={index} isActive={index === currentPage} colors={colors} />
      ))}
    </View>
  );
}

function OnboardingPage({ screen, index, isActive }: { screen: OnboardingScreen; index: number; isActive: boolean }) {
  const { colors, iconColor } = useTheme();
  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (isActive) {
      iconScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, { damping: 10 })
      );
      iconOpacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 300 })
      );
    }
  }, [isActive]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
      opacity: iconOpacity.value,
    };
  });

  const Icon = screen.icon;

  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: colors.background }}>
      <Animated.View style={iconAnimatedStyle} className="mb-12">
        <Icon size={80} color={iconColor} />
      </Animated.View>

      <Text
        className="text-3xl font-bold text-center mb-4"
        style={{ fontFamily: 'Nunito_700Bold', color: colors.text, maxWidth: width - 48 }}>
        {screen.title}
      </Text>

      <Text
        className="text-lg text-center"
        style={{ fontFamily: 'Nunito_400Regular', color: colors.textLight, maxWidth: width - 96 }}>
        {screen.subtitle}
      </Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, iconColor } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleNext = () => {
    if (currentPage < screens.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      router.replace('/');
    }
  };

  const handlePageChange = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Skip Button */}
      {currentPage < screens.length - 1 && (
        <Pressable
          onPress={handleSkip}
          className="absolute top-12 right-6 z-10"
          style={{ zIndex: 10 }}>
          <X size={24} color={iconColor} />
        </Pressable>
      )}

      {/* Pager View */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageChange}>
        {screens.map((screen, index) => (
          <OnboardingPage
            key={index}
            screen={screen}
            index={index}
            isActive={index === currentPage}
          />
        ))}
      </PagerView>

      <DotIndicators currentPage={currentPage} totalScreens={screens.length} colors={colors} />

      {/* Navigation Buttons */}
      <View className="px-6 pb-8">
        {currentPage < screens.length - 1 ? (
          <Button
            title="Next"
            onPress={handleNext}
            variant="primary"
            icon={<ArrowRight size={20} color="white" />}
            className="w-full"
          />
        ) : (
          <Button
            title="Get Started"
            onPress={handleComplete}
            variant="primary"
            className="w-full"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

