import { VetColors } from '@/constants/theme';
import { Stack } from 'expo-router';

export default function EmergencyLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: VetColors.emergency,
                },
                headerTintColor: VetColors.textInverse,
                headerTitleStyle: {
                    fontWeight: '700',
                },
                contentStyle: {
                    backgroundColor: VetColors.background,
                },
            }}
        >
            <Stack.Screen
                name="toxicity"
                options={{ title: '⚠️ Toxicity Calculator' }}
            />
            <Stack.Screen
                name="antidotes"
                options={{ title: '💉 Antidote Reference' }}
            />
            <Stack.Screen
                name="cpr-reference"
                options={{ title: '❤️ CPR Protocols' }}
            />
        </Stack>
    );
}
