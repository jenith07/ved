/**
 * Emergency Floating Action Button
 * Quick access to emergency protocols from any screen
 */
import { Radius, Spacing, VetColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import {
    AlertTriangle,
    Beaker,
    HeartPulse,
    Syringe,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EmergencyAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    route: string;
    color: string;
}

const EMERGENCY_ACTIONS: EmergencyAction[] = [
    {
        id: 'cpr',
        label: 'CPR Reference',
        icon: <HeartPulse size={22} color={VetColors.textInverse} />,
        route: '/emergency/cpr-reference',
        color: VetColors.emergency,
    },
    {
        id: 'toxicity',
        label: 'Toxicity Calculator',
        icon: <Beaker size={22} color={VetColors.textInverse} />,
        route: '/emergency/toxicity',
        color: VetColors.warning,
    },
    {
        id: 'antidotes',
        label: 'Antidotes',
        icon: <Syringe size={22} color={VetColors.textInverse} />,
        route: '/emergency/antidotes',
        color: VetColors.primary,
    },
];

export function EmergencyFAB() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const toggleMenu = () => {
        const toValue = isExpanded ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
        }).start();

        setIsExpanded(!isExpanded);
    };

    const handleAction = (route: string) => {
        setIsExpanded(false);
        Animated.timing(animation, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start();

        router.push(route as any);
    };

    const overlayOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });

    const fabRotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <>
            {/* Overlay */}
            {isExpanded && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                    pointerEvents={isExpanded ? 'auto' : 'none'}
                >
                    <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu} />
                </Animated.View>
            )}

            {/* FAB Container */}
            <View style={[styles.container, { bottom: insets.bottom + 80 }]}>
                {/* Action Buttons */}
                {EMERGENCY_ACTIONS.map((action, index) => {
                    const translateY = animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -(index + 1) * 60],
                    });

                    const scale = animation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.5, 1],
                    });

                    const opacity = animation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.5, 1],
                    });

                    return (
                        <Animated.View
                            key={action.id}
                            style={[
                                styles.actionContainer,
                                {
                                    transform: [{ translateY }, { scale }],
                                    opacity,
                                },
                            ]}
                        >
                            <Pressable
                                style={styles.actionLabel}
                                onPress={() => handleAction(action.route)}
                            >
                                <Text style={styles.actionLabelText}>{action.label}</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.actionButton, { backgroundColor: action.color }]}
                                onPress={() => handleAction(action.route)}
                            >
                                {action.icon}
                            </Pressable>
                        </Animated.View>
                    );
                })}

                {/* Main FAB */}
                <Pressable style={styles.fab} onPress={toggleMenu}>
                    <Animated.View style={{ transform: [{ rotate: fabRotation }] }}>
                        {isExpanded ? (
                            <X size={28} color={VetColors.textInverse} />
                        ) : (
                            <AlertTriangle size={28} color={VetColors.textInverse} />
                        )}
                    </Animated.View>
                </Pressable>

                {!isExpanded && (
                    <View style={styles.fabBadge}>
                        <Text style={styles.fabBadgeText}>SOS</Text>
                    </View>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 999,
    },
    container: {
        position: 'absolute',
        right: Spacing.lg,
        zIndex: 1000,
        alignItems: 'flex-end',
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: VetColors.emergency,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: VetColors.emergency,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    fabBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: VetColors.text,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: Radius.full,
    },
    fabBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: VetColors.textInverse,
    },
    actionContainer: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    actionLabel: {
        backgroundColor: VetColors.background,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    actionLabelText: {
        fontSize: 14,
        fontWeight: '500',
        color: VetColors.text,
    },
});

export default EmergencyFAB;
