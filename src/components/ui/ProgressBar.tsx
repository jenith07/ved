import { Radius, Spacing, VetColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';

interface ProgressBarProps {
    progress: number; // 0-100
    height?: number;
    backgroundColor?: string;
    progressColor?: string;
    gradientColors?: [string, string];
    showLabel?: boolean;
    label?: string;
    style?: ViewStyle;
}

export function ProgressBar({
    progress,
    height = 8,
    backgroundColor = VetColors.backgroundTertiary,
    progressColor = VetColors.primary,
    showLabel = false,
    label,
    style,
}: ProgressBarProps) {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    const animatedWidth = useAnimatedStyle(() => ({
        width: withSpring(`${clampedProgress}%`, { damping: 15 }),
    }));

    return (
        <View style={style}>
            {(showLabel || label) && (
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>{label}</Text>
                    {showLabel && <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>}
                </View>
            )}
            <View style={[styles.track, { height, backgroundColor }]}>
                <Animated.View
                    style={[
                        styles.progress,
                        { height, backgroundColor: progressColor },
                        animatedWidth,
                    ]}
                />
            </View>
        </View>
    );
}

// XP-style progress bar matching reference UI
interface XPProgressBarProps {
    currentXP: number;
    maxXP: number;
    level: number;
    style?: ViewStyle;
}

export function XPProgressBar({ currentXP, maxXP, level, style }: XPProgressBarProps) {
    const progress = (currentXP / maxXP) * 100;

    return (
        <View style={[styles.xpContainer, style]}>
            <View style={styles.xpHeader}>
                <View style={styles.xpLevelBadge}>
                    <Text style={styles.xpLevelText}>Level {level}</Text>
                </View>
                <Text style={styles.xpProgress}>
                    {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
                </Text>
            </View>
            <View style={styles.xpTrack}>
                <Animated.View
                    style={[
                        styles.xpProgressFill,
                        { width: `${Math.min(100, progress)}%` },
                    ]}
                />
            </View>
            <Text style={styles.xpRemaining}>
                {(maxXP - currentXP).toLocaleString()} XP to Level {level + 1}
            </Text>
        </View>
    );
}

// Segmented progress (like BCS scale visualization)
interface SegmentedProgressProps {
    segments: number;
    activeSegment: number;
    colors?: string[];
    labels?: string[];
    style?: ViewStyle;
}

export function SegmentedProgress({
    segments,
    activeSegment,
    colors,
    labels,
    style,
}: SegmentedProgressProps) {
    const defaultColors = [
        VetColors.danger,
        VetColors.dangerLight,
        VetColors.warning,
        VetColors.warningLight,
        VetColors.success,
        VetColors.successLight,
        VetColors.warning,
        VetColors.dangerLight,
        VetColors.danger,
    ];

    const segmentColors = colors || defaultColors.slice(0, segments);

    return (
        <View style={[styles.segmentedContainer, style]}>
            <View style={styles.segmentedTrack}>
                {Array.from({ length: segments }, (_, i) => {
                    const isActive = i + 1 === activeSegment;
                    const color = segmentColors[i] || VetColors.backgroundTertiary;

                    return (
                        <View
                            key={i}
                            style={[
                                styles.segment,
                                {
                                    backgroundColor: i + 1 <= activeSegment ? color : VetColors.backgroundTertiary,
                                    borderColor: isActive ? VetColors.text : 'transparent',
                                },
                                i === 0 && styles.segmentFirst,
                                i === segments - 1 && styles.segmentLast,
                            ]}
                        />
                    );
                })}
            </View>
            {labels && (
                <View style={styles.segmentLabels}>
                    {labels.map((label, i) => (
                        <Text
                            key={i}
                            style={[
                                styles.segmentLabel,
                                i + 1 === activeSegment && styles.segmentLabelActive,
                            ]}
                        >
                            {label}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}

// Circular progress indicator
interface CircularProgressProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    showValue?: boolean;
    label?: string;
    style?: ViewStyle;
}

export function CircularProgress({
    progress,
    size = 80,
    strokeWidth = 8,
    color = VetColors.primary,
    backgroundColor = VetColors.backgroundTertiary,
    showValue = true,
    label,
    style,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedProgress = Math.max(0, Math.min(100, progress));
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
        <View style={[{ width: size, height: size }, style]}>
            {/* Background circle - using View since we don't have svg */}
            <View
                style={[
                    styles.circularTrack,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: backgroundColor,
                    },
                ]}
            />
            {/* Progress arc - simplified using border */}
            <View
                style={[
                    styles.circularProgress,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: color,
                        borderTopColor: 'transparent',
                        borderRightColor: clampedProgress > 25 ? color : 'transparent',
                        borderBottomColor: clampedProgress > 50 ? color : 'transparent',
                        borderLeftColor: clampedProgress > 75 ? color : 'transparent',
                        transform: [{ rotate: '-45deg' }],
                    },
                ]}
            />
            {/* Center content */}
            <View style={styles.circularContent}>
                {showValue && (
                    <Text style={styles.circularValue}>{Math.round(clampedProgress)}%</Text>
                )}
                {label && <Text style={styles.circularLabel}>{label}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Linear progress
    track: {
        borderRadius: Radius.full,
        overflow: 'hidden',
    },
    progress: {
        borderRadius: Radius.full,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    label: {
        fontSize: 14,
        color: VetColors.textSecondary,
    },
    percentage: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
    },

    // XP progress
    xpContainer: {
        padding: Spacing.base,
        backgroundColor: VetColors.cardPurple,
        borderRadius: Radius.lg,
    },
    xpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    xpLevelBadge: {
        backgroundColor: VetColors.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    xpLevelText: {
        color: VetColors.textInverse,
        fontWeight: '600',
        fontSize: 12,
    },
    xpProgress: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
    },
    xpTrack: {
        height: 12,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderRadius: Radius.full,
        overflow: 'hidden',
    },
    xpProgressFill: {
        height: '100%',
        backgroundColor: VetColors.primary,
        borderRadius: Radius.full,
    },
    xpRemaining: {
        fontSize: 12,
        color: VetColors.textSecondary,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },

    // Segmented progress
    segmentedContainer: {},
    segmentedTrack: {
        flexDirection: 'row',
        gap: 2,
    },
    segment: {
        flex: 1,
        height: 24,
        borderWidth: 2,
    },
    segmentFirst: {
        borderTopLeftRadius: Radius.md,
        borderBottomLeftRadius: Radius.md,
    },
    segmentLast: {
        borderTopRightRadius: Radius.md,
        borderBottomRightRadius: Radius.md,
    },
    segmentLabels: {
        flexDirection: 'row',
        marginTop: Spacing.xs,
    },
    segmentLabel: {
        flex: 1,
        fontSize: 10,
        color: VetColors.textMuted,
        textAlign: 'center',
    },
    segmentLabelActive: {
        fontWeight: '600',
        color: VetColors.text,
    },

    // Circular progress
    circularTrack: {
        position: 'absolute',
    },
    circularProgress: {
        position: 'absolute',
    },
    circularContent: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circularValue: {
        fontSize: 18,
        fontWeight: '700',
        color: VetColors.text,
    },
    circularLabel: {
        fontSize: 10,
        color: VetColors.textSecondary,
    },
});
