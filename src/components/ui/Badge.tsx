import { Radius, Spacing, VetColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'category' | 'species';
type BadgeSize = 'sm' | 'md' | 'lg' | 'small' | 'medium';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: React.ReactNode;
    rounded?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    icon,
    rounded = false,
    style,
    textStyle,
}: BadgeProps) {
    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (variant) {
            case 'primary':
                return {
                    container: { backgroundColor: VetColors.cardPurple },
                    text: { color: VetColors.primary },
                };
            case 'secondary':
                return {
                    container: { backgroundColor: VetColors.cardCyan },
                    text: { color: VetColors.secondary },
                };
            case 'success':
                return {
                    container: { backgroundColor: VetColors.cardGreen },
                    text: { color: VetColors.success },
                };
            case 'warning':
                return {
                    container: { backgroundColor: VetColors.cardOrange },
                    text: { color: VetColors.warning },
                };
            case 'danger':
                return {
                    container: { backgroundColor: VetColors.cardRed },
                    text: { color: VetColors.danger },
                };
            case 'info':
                return {
                    container: { backgroundColor: VetColors.cardBlue },
                    text: { color: VetColors.secondaryDark },
                };
            case 'category':
                return {
                    container: { backgroundColor: VetColors.primaryLight },
                    text: { color: VetColors.primary },
                };
            case 'species':
                return {
                    container: { backgroundColor: VetColors.secondaryLight },
                    text: { color: VetColors.secondary },
                };
            default:
                return {
                    container: { backgroundColor: VetColors.backgroundTertiary },
                    text: { color: VetColors.text },
                };
        }
    };

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (size) {
            case 'sm':
            case 'small':
                return {
                    container: { paddingHorizontal: Spacing.sm, paddingVertical: 2 },
                    text: { fontSize: 10 },
                };
            case 'lg':
                return {
                    container: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
                    text: { fontSize: 14 },
                };
            default:
                return {
                    container: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
                    text: { fontSize: 12 },
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <View
            style={[
                styles.badge,
                variantStyles.container,
                sizeStyles.container,
                rounded && styles.rounded,
                style,
            ]}
        >
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}>
                {children}
            </Text>
        </View>
    );
}

// Status badge with dot indicator
interface StatusBadgeProps {
    status: 'online' | 'offline' | 'pending' | 'syncing';
    label?: string;
    style?: ViewStyle;
}

export function StatusBadge({ status, label, style }: StatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'online':
                return { color: VetColors.success, label: label || 'Online' };
            case 'offline':
                return { color: VetColors.textMuted, label: label || 'Offline' };
            case 'pending':
                return { color: VetColors.warning, label: label || 'Pending' };
            case 'syncing':
                return { color: VetColors.secondary, label: label || 'Syncing' };
        }
    };

    const config = getStatusConfig();

    return (
        <View style={[styles.statusBadge, style]}>
            <View style={[styles.statusDot, { backgroundColor: config.color }]} />
            <Text style={styles.statusText}>{config.label}</Text>
        </View>
    );
}

// Species badge with color coding
interface SpeciesBadgeProps {
    species: string;
    color?: string;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export function SpeciesBadge({ species, color, icon, style }: SpeciesBadgeProps) {
    return (
        <View
            style={[
                styles.speciesBadge,
                { backgroundColor: color ? `${color}20` : VetColors.cardPurple },
                style,
            ]}
        >
            {icon && <View style={styles.speciesIcon}>{icon}</View>}
            <Text style={[styles.speciesText, color && { color }]}>{species}</Text>
        </View>
    );
}

// Safety level badge
interface SafetyBadgeProps {
    level: 'safe' | 'caution' | 'danger' | 'critical';
    showLabel?: boolean;
    style?: ViewStyle;
}

export function SafetyBadge({ level, showLabel = true, style }: SafetyBadgeProps) {
    const getConfig = () => {
        switch (level) {
            case 'safe':
                return {
                    color: VetColors.success,
                    bgColor: VetColors.cardGreen,
                    label: 'Safe',
                };
            case 'caution':
                return {
                    color: VetColors.warning,
                    bgColor: VetColors.cardOrange,
                    label: 'Caution',
                };
            case 'danger':
                return {
                    color: VetColors.danger,
                    bgColor: VetColors.cardRed,
                    label: 'Danger',
                };
            case 'critical':
                return {
                    color: VetColors.emergency,
                    bgColor: '#FEE2E2',
                    label: 'CRITICAL',
                };
        }
    };

    const config = getConfig();

    return (
        <View style={[styles.safetyBadge, { backgroundColor: config.bgColor }, style]}>
            <View style={[styles.safetyDot, { backgroundColor: config.color }]} />
            {showLabel && (
                <Text style={[styles.safetyText, { color: config.color }]}>{config.label}</Text>
            )}
        </View>
    );
}

// Count badge (for notifications, etc.)
interface CountBadgeProps {
    count: number;
    max?: number;
    color?: string;
    style?: ViewStyle;
}

export function CountBadge({ count, max = 99, color = VetColors.danger, style }: CountBadgeProps) {
    const displayCount = count > max ? `${max}+` : count.toString();

    return (
        <View style={[styles.countBadge, { backgroundColor: color }, style]}>
            <Text style={styles.countText}>{displayCount}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Radius.md,
    },
    rounded: {
        borderRadius: Radius.full,
    },
    icon: {
        marginRight: Spacing.xs,
    },
    text: {
        fontWeight: '600',
    },

    // Status badge
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: Spacing.xs,
    },
    statusText: {
        fontSize: 12,
        color: VetColors.textSecondary,
    },

    // Species badge
    speciesBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    speciesIcon: {
        marginRight: Spacing.xs,
    },
    speciesText: {
        fontSize: 12,
        fontWeight: '600',
        color: VetColors.primary,
        textTransform: 'capitalize',
    },

    // Safety badge
    safetyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    safetyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: Spacing.sm,
    },
    safetyText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    // Count badge
    countBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xs,
    },
    countText: {
        color: VetColors.textInverse,
        fontSize: 11,
        fontWeight: '700',
    },
});
