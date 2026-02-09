import { Radius, Spacing, VetColors } from '@/constants/theme';
import { useAppStore } from '@/src/store/useAppStore';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

interface SliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    label?: string;
    showValue?: boolean;
    valueFormatter?: (value: number) => string;
    onChange: (value: number) => void;
    trackColor?: string;
    activeColor?: string;
    style?: ViewStyle;
}

export function Slider({
    value,
    min,
    max,
    step = 1,
    label,
    showValue = true,
    valueFormatter,
    onChange,
    trackColor = VetColors.backgroundTertiary,
    activeColor = VetColors.primary,
    style,
}: SliderProps) {
    const { settings } = useAppStore();
    const translateX = useSharedValue(0);
    const width = useSharedValue(0);
    const startValue = useSharedValue(value);

    const clampValue = (val: number) => {
        const stepped = Math.round(val / step) * step;
        return Math.max(min, Math.min(max, stepped));
    };

    const triggerHaptic = () => {
        if (settings.hapticFeedback) {
            Haptics.selectionAsync();
        }
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            startValue.value = value;
        })
        .onUpdate((event) => {
            if (width.value === 0) return;
            const deltaRatio = event.translationX / width.value;
            const deltaValue = deltaRatio * (max - min);
            const newValue = clampValue(startValue.value + deltaValue);
            if (newValue !== value) {
                runOnJS(triggerHaptic)();
                runOnJS(onChange)(newValue);
            }
        });

    const tapGesture = Gesture.Tap().onEnd((event) => {
        if (width.value === 0) return;
        const ratio = event.x / width.value;
        const newValue = clampValue(min + ratio * (max - min));
        runOnJS(triggerHaptic)();
        runOnJS(onChange)(newValue);
    });

    const composedGesture = Gesture.Race(panGesture, tapGesture);

    const progress = ((value - min) / (max - min)) * 100;

    const animatedThumbStyle = useAnimatedStyle(() => ({
        left: `${progress}%`,
        transform: [{ translateX: -12 }],
    }));

    const displayValue = valueFormatter ? valueFormatter(value) : value.toString();

    return (
        <View style={[styles.container, style]}>
            {(label || showValue) && (
                <View style={styles.header}>
                    {label && <Text style={styles.label}>{label}</Text>}
                    {showValue && <Text style={styles.value}>{displayValue}</Text>}
                </View>
            )}
            <GestureDetector gesture={composedGesture}>
                <View
                    style={styles.trackContainer}
                    onLayout={(e) => {
                        width.value = e.nativeEvent.layout.width;
                    }}
                >
                    <View style={[styles.track, { backgroundColor: trackColor }]}>
                        <View
                            style={[
                                styles.activeTrack,
                                { backgroundColor: activeColor, width: `${progress}%` },
                            ]}
                        />
                    </View>
                    <Animated.View style={[styles.thumb, animatedThumbStyle]}>
                        <View style={[styles.thumbInner, { backgroundColor: activeColor }]} />
                    </Animated.View>
                </View>
            </GestureDetector>
            <View style={styles.labels}>
                <Text style={styles.minLabel}>{min}</Text>
                <Text style={styles.maxLabel}>{max}</Text>
            </View>
        </View>
    );
}

// BCS (Body Condition Score) Slider - specialized for 1-9 scale
interface BCSSliderProps {
    value: number;
    onChange: (value: number) => void;
    species?: 'standard' | 'avian' | 'reptile'; // Different scales
    showChart?: boolean;
    style?: ViewStyle;
}

export function BCSSlider({
    value,
    onChange,
    species = 'standard',
    showChart = true,
    style,
}: BCSSliderProps) {
    const { settings } = useAppStore();
    const maxBCS = species === 'standard' ? 9 : 5;
    const idealBCS = species === 'standard' ? 5 : 3;

    const getBCSDescription = (bcs: number) => {
        if (species === 'standard') {
            if (bcs <= 2) return 'Emaciated';
            if (bcs <= 3) return 'Underweight';
            if (bcs <= 4) return 'Lean';
            if (bcs === 5) return 'Ideal';
            if (bcs <= 6) return 'Slightly Overweight';
            if (bcs <= 7) return 'Overweight';
            if (bcs <= 8) return 'Obese';
            return 'Severely Obese';
        } else {
            if (bcs <= 1) return 'Emaciated';
            if (bcs <= 2) return 'Underweight';
            if (bcs === 3) return 'Ideal';
            if (bcs <= 4) return 'Overweight';
            return 'Obese';
        }
    };

    const getBCSColor = (bcs: number) => {
        const ideal = idealBCS;
        const diff = Math.abs(bcs - ideal);
        if (diff === 0) return VetColors.success;
        if (diff === 1) return VetColors.successLight;
        if (diff === 2) return VetColors.warning;
        if (diff >= 3) return VetColors.danger;
        return VetColors.textSecondary;
    };

    const handlePress = (bcs: number) => {
        if (settings.hapticFeedback) {
            Haptics.selectionAsync();
        }
        onChange(bcs);
    };

    return (
        <View style={[styles.bcsContainer, style]}>
            <View style={styles.bcsHeader}>
                <Text style={styles.label}>Body Condition Score</Text>
                <Text style={[styles.bcsValue, { color: getBCSColor(value) }]}>
                    {value}/{maxBCS}
                </Text>
            </View>
            <Text style={[styles.bcsDescription, { color: getBCSColor(value) }]}>
                {getBCSDescription(value)}
            </Text>

            {showChart && (
                <View style={styles.bcsChart}>
                    {Array.from({ length: maxBCS }, (_, i) => {
                        const bcs = i + 1;
                        const isSelected = bcs === value;
                        const isIdeal = bcs === idealBCS;

                        return (
                            <Pressable
                                key={bcs}
                                onPress={() => handlePress(bcs)}
                                style={[
                                    styles.bcsSegment,
                                    isSelected && styles.bcsSegmentSelected,
                                    isIdeal && !isSelected && styles.bcsSegmentIdeal,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.bcsSegmentBar,
                                        {
                                            height: 12 + bcs * 4,
                                            backgroundColor: isSelected ? getBCSColor(bcs) : VetColors.backgroundTertiary,
                                        },
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.bcsSegmentLabel,
                                        isSelected && { color: getBCSColor(bcs), fontWeight: '700' },
                                    ]}
                                >
                                    {bcs}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}

            <View style={styles.bcsLegend}>
                <Text style={styles.bcsLegendText}>Underweight</Text>
                <Text style={[styles.bcsLegendText, { color: VetColors.success }]}>Ideal</Text>
                <Text style={styles.bcsLegendText}>Overweight</Text>
            </View>
        </View>
    );
}

// Temperature slider for reptile metabolism
interface TemperatureSliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    unit?: 'C' | 'F';
    style?: ViewStyle;
}

export function TemperatureSlider({
    value,
    onChange,
    min = 15,
    max = 35,
    unit = 'C',
    style,
}: TemperatureSliderProps) {
    const getTemperatureColor = (temp: number) => {
        if (unit === 'C') {
            if (temp < 20) return VetColors.secondary; // Cold
            if (temp < 25) return VetColors.secondaryLight;
            if (temp < 30) return VetColors.success; // Optimal
            if (temp < 33) return VetColors.warning;
            return VetColors.danger; // Too hot
        }
        return VetColors.primary;
    };

    return (
        <Slider
            value={value}
            min={min}
            max={max}
            step={0.5}
            label="Ambient Temperature"
            showValue
            valueFormatter={(v) => `${v}°${unit}`}
            onChange={onChange}
            activeColor={getTemperatureColor(value)}
            style={style}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.base,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: VetColors.primary,
    },
    trackContainer: {
        height: 32,
        justifyContent: 'center',
        position: 'relative',
    },
    track: {
        height: 6,
        borderRadius: Radius.full,
        overflow: 'hidden',
    },
    activeTrack: {
        height: '100%',
        borderRadius: Radius.full,
    },
    thumb: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: VetColors.background,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.xs,
    },
    minLabel: {
        fontSize: 12,
        color: VetColors.textMuted,
    },
    maxLabel: {
        fontSize: 12,
        color: VetColors.textMuted,
    },

    // BCS Slider
    bcsContainer: {
        marginBottom: Spacing.base,
    },
    bcsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bcsValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    bcsDescription: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: Spacing.xs,
        marginBottom: Spacing.md,
    },
    bcsChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 60,
        marginBottom: Spacing.sm,
    },
    bcsSegment: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    bcsSegmentSelected: {
        transform: [{ scale: 1.1 }],
    },
    bcsSegmentIdeal: {
        opacity: 0.8,
    },
    bcsSegmentBar: {
        width: '100%',
        borderRadius: Radius.sm,
        marginBottom: Spacing.xs,
    },
    bcsSegmentLabel: {
        fontSize: 10,
        color: VetColors.textMuted,
    },
    bcsLegend: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.sm,
    },
    bcsLegendText: {
        fontSize: 11,
        color: VetColors.textMuted,
    },
});
