import { Radius, Shadows, Spacing, TouchTargets, VetColors } from '@/constants/theme';
import { useAppStore } from '@/src/store/useAppStore';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'emergency';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    style?: ViewStyle;
    textStyle?: TextStyle;
    onPress?: () => void;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    style,
    textStyle,
    onPress,
}: ButtonProps) {
    const { settings } = useAppStore();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const handlePress = () => {
        if (disabled || loading) return;

        if (settings.hapticFeedback) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        onPress?.();
    };

    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (variant) {
            case 'primary':
                return {
                    container: {
                        backgroundColor: disabled ? VetColors.primaryLight : VetColors.primary,
                        ...Shadows.sm,
                    },
                    text: {
                        color: VetColors.textInverse,
                    },
                };
            case 'secondary':
                return {
                    container: {
                        backgroundColor: disabled ? VetColors.secondaryLight : VetColors.secondary,
                        ...Shadows.sm,
                    },
                    text: {
                        color: VetColors.textInverse,
                    },
                };
            case 'outline':
                return {
                    container: {
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderColor: disabled ? VetColors.border : VetColors.primary,
                    },
                    text: {
                        color: disabled ? VetColors.textMuted : VetColors.primary,
                    },
                };
            case 'ghost':
                return {
                    container: {
                        backgroundColor: 'transparent',
                    },
                    text: {
                        color: disabled ? VetColors.textMuted : VetColors.primary,
                    },
                };
            case 'danger':
                return {
                    container: {
                        backgroundColor: disabled ? VetColors.dangerLight : VetColors.danger,
                        ...Shadows.sm,
                    },
                    text: {
                        color: VetColors.textInverse,
                    },
                };
            case 'emergency':
                return {
                    container: {
                        backgroundColor: disabled ? VetColors.emergencyLight : VetColors.emergency,
                        ...Shadows.md,
                    },
                    text: {
                        color: VetColors.textInverse,
                        fontWeight: '700',
                    },
                };
            default:
                return {
                    container: {},
                    text: {},
                };
        }
    };

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (size) {
            case 'sm':
                return {
                    container: {
                        paddingVertical: Spacing.sm,
                        paddingHorizontal: Spacing.md,
                        minHeight: TouchTargets.min,
                        borderRadius: Radius.md,
                    },
                    text: {
                        fontSize: 14,
                    },
                };
            case 'lg':
                return {
                    container: {
                        paddingVertical: Spacing.base,
                        paddingHorizontal: Spacing.xl,
                        minHeight: TouchTargets.large,
                        borderRadius: Radius.xl,
                    },
                    text: {
                        fontSize: 18,
                    },
                };
            default: // md
                return {
                    container: {
                        paddingVertical: Spacing.md,
                        paddingHorizontal: Spacing.lg,
                        minHeight: TouchTargets.recommended,
                        borderRadius: Radius.lg,
                    },
                    text: {
                        fontSize: 16,
                    },
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[
                styles.button,
                variantStyles.container,
                sizeStyles.container,
                fullWidth && styles.fullWidth,
                animatedStyle,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variantStyles.text.color as string}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <Animated.View style={styles.iconLeft}>{icon}</Animated.View>
                    )}
                    <Text
                        style={[
                            styles.text,
                            variantStyles.text,
                            sizeStyles.text,
                            textStyle,
                        ]}
                    >
                        {children}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <Animated.View style={styles.iconRight}>{icon}</Animated.View>
                    )}
                </>
            )}
        </AnimatedPressable>
    );
}

// Icon-only button variant
interface IconButtonProps {
    icon: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    style?: ViewStyle;
    onPress?: () => void;
}

export function IconButton({
    icon,
    variant = 'ghost',
    size = 'md',
    disabled = false,
    style,
    onPress,
}: IconButtonProps) {
    const { settings } = useAppStore();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.9, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const handlePress = () => {
        if (disabled) return;

        if (settings.hapticFeedback) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        onPress?.();
    };

    const getSize = () => {
        switch (size) {
            case 'sm':
                return TouchTargets.min;
            case 'lg':
                return TouchTargets.large;
            default:
                return TouchTargets.recommended;
        }
    };

    const buttonSize = getSize();

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[
                styles.iconButton,
                {
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: buttonSize / 2,
                },
                variant === 'primary' && { backgroundColor: VetColors.primary },
                variant === 'secondary' && { backgroundColor: VetColors.secondary },
                variant === 'danger' && { backgroundColor: VetColors.danger },
                variant === 'emergency' && { backgroundColor: VetColors.emergency },
                animatedStyle,
                style,
            ]}
        >
            {icon}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
    iconLeft: {
        marginRight: Spacing.sm,
    },
    iconRight: {
        marginLeft: Spacing.sm,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
