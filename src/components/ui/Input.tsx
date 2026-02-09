import { Radius, Spacing, TouchTargets, VetColors } from '@/constants/theme';
import { Eye, EyeOff, Search, X } from 'lucide-react-native';
import React, { forwardRef, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    disabled?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            containerStyle,
            inputStyle,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const focusAnim = useSharedValue(0);

        const handleFocus = (e: any) => {
            setIsFocused(true);
            focusAnim.value = withSpring(1);
            props.onFocus?.(e);
        };

        const handleBlur = (e: any) => {
            setIsFocused(false);
            focusAnim.value = withSpring(0);
            props.onBlur?.(e);
        };

        const animatedBorderStyle = useAnimatedStyle(() => {
            const borderColor = interpolateColor(
                focusAnim.value,
                [0, 1],
                [error ? VetColors.danger : VetColors.border, error ? VetColors.danger : VetColors.primary]
            );
            return { borderColor };
        });

        return (
            <View style={[styles.container, containerStyle]}>
                {label && <Text style={styles.label}>{label}</Text>}
                <Animated.View
                    style={[
                        styles.inputContainer,
                        disabled && styles.disabled,
                        animatedBorderStyle,
                    ]}
                >
                    {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                    <AnimatedTextInput
                        ref={ref}
                        style={[
                            styles.input,
                            leftIcon ? styles.inputWithLeftIcon : undefined,
                            rightIcon ? styles.inputWithRightIcon : undefined,
                            disabled ? styles.inputDisabled : undefined,
                            inputStyle,
                        ]}
                        placeholderTextColor={VetColors.textMuted}
                        editable={!disabled}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...props}
                    />
                    {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
                </Animated.View>
                {error && <Text style={styles.error}>{error}</Text>}
                {hint && !error && <Text style={styles.hint}>{hint}</Text>}
            </View>
        );
    }
);

Input.displayName = 'Input';

// Password input with visibility toggle
interface PasswordInputProps extends Omit<InputProps, 'rightIcon' | 'secureTextEntry'> { }

export function PasswordInput(props: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <Input
            {...props}
            secureTextEntry={!isVisible}
            rightIcon={
                <Pressable onPress={() => setIsVisible(!isVisible)}>
                    {isVisible ? (
                        <EyeOff size={20} color={VetColors.textSecondary} />
                    ) : (
                        <Eye size={20} color={VetColors.textSecondary} />
                    )}
                </Pressable>
            }
        />
    );
}

// Search input with clear button
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
    onClear?: () => void;
}

export function SearchInput({ value, onClear, ...props }: SearchInputProps) {
    return (
        <Input
            {...props}
            value={value}
            leftIcon={<Search size={20} color={VetColors.textMuted} />}
            rightIcon={
                value ? (
                    <Pressable onPress={onClear}>
                        <X size={20} color={VetColors.textSecondary} />
                    </Pressable>
                ) : undefined
            }
        />
    );
}

// Numeric input for weight, doses, etc.
interface NumericInputProps extends Omit<InputProps, 'keyboardType'> {
    suffix?: string;
    prefix?: string;
    allowDecimal?: boolean;
}

export function NumericInput({
    suffix,
    prefix,
    allowDecimal = true,
    value,
    onChangeText,
    ...props
}: NumericInputProps) {
    const handleChange = (text: string) => {
        // Filter to only allow numbers and optionally decimal
        const regex = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
        if (regex.test(text) || text === '') {
            onChangeText?.(text);
        }
    };

    return (
        <Input
            {...props}
            value={value}
            onChangeText={handleChange}
            keyboardType={allowDecimal ? 'decimal-pad' : 'number-pad'}
            leftIcon={prefix ? <Text style={styles.affixText}>{prefix}</Text> : undefined}
            rightIcon={suffix ? <Text style={styles.affixText}>{suffix}</Text> : undefined}
        />
    );
}

// Large numeric input for weight entry (matches reference UI)
interface LargeNumericInputProps {
    value: string;
    onChangeText: (text: string) => void;
    unit: string;
    onUnitToggle?: () => void;
    alternateUnit?: string;
    label?: string;
    error?: string;
    style?: ViewStyle;
}

export function LargeNumericInput({
    value,
    onChangeText,
    unit,
    onUnitToggle,
    alternateUnit,
    label,
    error,
    style,
}: LargeNumericInputProps) {
    const handleChange = (text: string) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        if (regex.test(text) || text === '') {
            onChangeText(text);
        }
    };

    return (
        <View style={[styles.largeInputContainer, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.largeInputWrapper, error && styles.largeInputError]}>
                <TextInput
                    style={styles.largeInput}
                    value={value}
                    onChangeText={handleChange}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={VetColors.textMuted}
                />
                <View style={styles.unitContainer}>
                    <Pressable
                        style={[styles.unitButton, styles.unitButtonActive]}
                        onPress={onUnitToggle}
                    >
                        <Text style={styles.unitButtonTextActive}>{unit}</Text>
                    </Pressable>
                    {alternateUnit && (
                        <Pressable style={styles.unitButton} onPress={onUnitToggle}>
                            <Text style={styles.unitButtonText}>{alternateUnit}</Text>
                        </Pressable>
                    )}
                </View>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.base,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
        marginBottom: Spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: TouchTargets.recommended,
        backgroundColor: VetColors.background,
        borderWidth: 1.5,
        borderColor: VetColors.border,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.base,
    },
    disabled: {
        backgroundColor: VetColors.backgroundTertiary,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: VetColors.text,
        paddingVertical: Spacing.md,
    },
    inputWithLeftIcon: {
        paddingLeft: Spacing.sm,
    },
    inputWithRightIcon: {
        paddingRight: Spacing.sm,
    },
    inputDisabled: {
        color: VetColors.textMuted,
    },
    leftIcon: {
        marginRight: Spacing.sm,
    },
    rightIcon: {
        marginLeft: Spacing.sm,
    },
    error: {
        fontSize: 12,
        color: VetColors.danger,
        marginTop: Spacing.xs,
    },
    hint: {
        fontSize: 12,
        color: VetColors.textSecondary,
        marginTop: Spacing.xs,
    },
    affixText: {
        fontSize: 16,
        color: VetColors.textSecondary,
        fontWeight: '500',
    },

    // Large numeric input
    largeInputContainer: {
        marginBottom: Spacing.base,
    },
    largeInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: VetColors.backgroundSecondary,
        borderRadius: Radius.xl,
        borderWidth: 2,
        borderColor: VetColors.border,
        padding: Spacing.sm,
    },
    largeInputError: {
        borderColor: VetColors.danger,
    },
    largeInput: {
        flex: 1,
        fontSize: 48,
        fontWeight: '700',
        color: VetColors.text,
        textAlign: 'center',
        paddingVertical: Spacing.lg,
    },
    unitContainer: {
        backgroundColor: VetColors.backgroundTertiary,
        borderRadius: Radius.lg,
        padding: Spacing.xs,
    },
    unitButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
    },
    unitButtonActive: {
        backgroundColor: VetColors.primary,
    },
    unitButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.textSecondary,
    },
    unitButtonTextActive: {
        color: VetColors.textInverse,
    },
});
