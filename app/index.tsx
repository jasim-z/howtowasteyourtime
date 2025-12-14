import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CloudMoon, Clock } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { MuteButton } from '@/components/MuteButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/lib/ThemeContext';
import { useStats } from '@/lib/StatsContext';
import { formatTime } from '@/lib/statsStorage';

export default function HomeScreen() {
  const router = useRouter();
  const { stats } = useStats();
  const { colors, iconColor } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ThemeToggle />
        <MuteButton />
        <View className="flex-1">
        {/* Spacer */}
        <View className="flex-1" />

        {/* App Title */}
        <Text 
          className="text-4xl font-bold text-center"
          style={{ fontFamily: 'Nunito_700Bold', color: colors.text }}>
          How To Waste Your Time
        </Text>

        {/* Subtitle */}
        <Text 
          className="text-lg text-center mt-2 italic"
          style={{ fontFamily: 'Nunito_400Regular', color: colors.textLight }}>
          A Mindless App
        </Text>

        {/* Spacer */}
        <View className="h-16" />

        {/* Icon */}
        <View className="items-center">
          <CloudMoon size={80} color={iconColor} />
        </View>

        {/* Tagline */}
        <Text 
          className="text-xl text-center mt-8"
          style={{ fontFamily: 'Nunito_400Regular', color: colors.text }}>
          Ready to do nothing?
        </Text>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Stats Display */}
        {stats && stats.totalSecondsToday > 0 && (
          <View className="mx-6 mb-4 items-center">
            <View className="flex-row items-center gap-2">
              <Clock size={14} color={colors.textLight} />
              <Text 
                className="text-sm"
                style={{ fontFamily: 'Nunito_400Regular', color: colors.textLight }}>
                You've wasted {formatTime(stats.totalSecondsToday)} today
              </Text>
            </View>
          </View>
        )}

        {/* Primary Button */}
        <View className="mx-6 mb-8">
          <Button
            title="Let's waste some time"
            onPress={() => router.push('/activities')}
            variant="primary"
            className="shadow-lg"
          />
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
}

