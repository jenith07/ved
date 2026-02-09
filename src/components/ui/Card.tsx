import { Radius, Shadows, Spacing, VetColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Pressable,
    PressableProps,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps extends Omit<PressableProps, 'style'> {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'glass' | 'gradient';
    backgroundColor?: string;
    gradientColors?: [string, string];
    style?: ViewStyle;
    padding?: keyof typeof Spacing | number;
    borderRadius?: keyof typeof Radius | number;
    pressable?: boolean;
}

export function Card({
    children,
    variant = 'default',
    backgroundColor,
    gradientColors,
    style,
    padding = 'base',
    borderRadius = 'lg',
    pressable = false,
    onPress,
    ...pressableProps
}: CardProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (pressable || onPress) {
            scale.value = withSpring(0.98, { damping: 15 });
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const paddingValue = typeof padding === 'number' ? padding : Spacing[padding];
    const radiusValue = typeof borderRadius === 'number' ? borderRadius : Radius[borderRadius];

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'elevated':
                return {
                    ...Shadows.md,
                    backgroundColor: backgroundColor || VetColors.background,
                };
            case 'glass':
                return {
                    backgroundColor: backgroundColor || 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    ...Shadows.sm,
                };
            case 'gradient':
                return {};
            default:
                return {
                    backgroundColor: backgroundColor || VetColors.background,
                    borderWidth: 1,
                    borderColor: VetColors.border,
                };
        }
    };

    const cardContent = (
        <View
            style={[
                styles.card,
                getVariantStyles(),
                {
                    padding: paddingValue,
                    borderRadius: radiusValue,
                },
                style,
            ]}
        >
            {children}
        </View>
    );

    if (variant === 'gradient' && gradientColors) {
        const gradientContent = (
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.card,
                    {
                        padding: paddingValue,
                        borderRadius: radiusValue,
                    },
                    Shadows.md,
                    style,
                ]}
            >
                {children}
            </LinearGradient>
        );

        if (pressable || onPress) {
            return (
                <AnimatedPressable
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={animatedStyle}
                    {...pressableProps}
                >
                    {gradientContent}
                </AnimatedPressable>
            );
        }

        return gradientContent;
    }

    if (pressable || onPress) {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={animatedStyle}
                {...pressableProps}
            >
                {cardContent}
            </AnimatedPressable>
        );
    }

    return cardContent;
}

// Specialty card variants for different sections
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: string;
    onPress?: () => void;
}

export function StatCard({ icon, label, value, color, onPress }: StatCardProps) {
    return (
        <Card
            variant="elevated"
            backgroundColor={color || VetColors.cardPurple}
            onPress={onPress}
            pressable={!!onPress}
            style={styles.statCard}
        >
            <View style={styles.statCardIcon}>{icon}</View>
            <View style={styles.statCardContent}>
                <Animated.Text style={styles.statCardValue}>{value}</Animated.Text>
                <Animated.Text style={styles.statCardLabel}>{label}</Animated.Text>
            </View>
        </Card>
    );
}

// Quick action card with gradient
interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    gradientColors?: [string, string];
    onPress?: () => void;
}

export function ActionCard({
    icon,
    title,
    subtitle,
    gradientColors = [VetColors.gradientPurpleStart, VetColors.gradientPurpleEnd],
    onPress,
}: ActionCardProps) {
    return (
        <Card
            variant="gradient"
            gradientColors={gradientColors}
            onPress={onPress}
            pressable={!!onPress}
            style={styles.actionCard}
        >
            <View style={styles.actionCardIcon}>{icon}</View>
            <Animated.Text style={styles.actionCardTitle}>{title}</Animated.Text>
            {subtitle && <Animated.Text style={styles.actionCardSubtitle}>{subtitle}</Animated.Text>}
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 140,
    },
    statCardIcon: {
        marginRight: Spacing.md,
    },
    statCardContent: {
        flex: 1,
    },
    statCardValue: {
        fontSize: 24,
        fontWeight: '700',
        color: VetColors.text,
    },
    statCardLabel: {
        fontSize: 12,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    actionCard: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    actionCardIcon: {
        marginBottom: Spacing.sm,
    },
    actionCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: VetColors.textInverse,
        textAlign: 'center',
    },
    actionCardSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 4,
    },
});
