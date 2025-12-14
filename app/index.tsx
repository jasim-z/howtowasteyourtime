import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CloudMoon } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Spacer */}
        <View className="flex-1" />

        {/* App Title */}
        <Text 
          className="text-4xl font-bold text-text text-center"
          style={{ fontFamily: 'Nunito_700Bold' }}>
          How To Waste Your Time
        </Text>

        {/* Subtitle */}
        <Text 
          className="text-lg text-textLight text-center mt-2 italic"
          style={{ fontFamily: 'Nunito_400Regular' }}>
          A Mindless App
        </Text>

        {/* Spacer */}
        <View className="h-16" />

        {/* Icon */}
        <View className="items-center">
          <CloudMoon size={80} color="#5C5470" />
        </View>

        {/* Tagline */}
        <Text 
          className="text-xl text-text text-center mt-8"
          style={{ fontFamily: 'Nunito_400Regular' }}>
          Ready to do nothing?
        </Text>

        {/* Spacer */}
        <View className="flex-1" />

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
    </SafeAreaView>
  );
}

