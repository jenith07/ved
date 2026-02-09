import * as Haptics from 'expo-haptics';
import {
    AlertTriangle,
    Check,
    ChevronRight,
    Database,
    Eye,
    Info,
    Moon,
    RefreshCw,
    Save,
    Shield,
    Sun,
    Vibrate,
    X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing, Typography, VetColors } from '@/constants/theme';
import { Badge, StatusBadge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAppStore } from '@/src/store/useAppStore';

export default function SettingsScreen() {
    const { settings, updateSettings, isOnline, pendingSyncCount } = useAppStore();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        if (!isOnline) return;
        setIsSyncing(true);
        if (settings.hapticFeedback) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        // Simulate sync
        setTimeout(() => {
            setIsSyncing(false);
            Alert.alert('Sync Complete', 'All data has been synchronized.');
        }, 2000);
    };

    const handleExportData = async () => {
        if (settings.hapticFeedback) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setShowExportModal(false);
        Alert.alert('Export Started', 'Your data export is being prepared. You will be notified when it\'s ready.');
    };

    const handleToggle = async (key: string, value: boolean) => {
        if (settings.hapticFeedback) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        updateSettings({ [key]: value });
    };

    const SettingRow = ({
        icon,
        label,
        description,
        children,
    }: {
        icon: React.ReactNode;
        label: string;
        description?: string;
        children: React.ReactNode;
    }) => (
        <View style={styles.settingRow}>
            <View style={styles.settingIcon}>{icon}</View>
            <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{label}</Text>
                {description && <Text style={styles.settingDescription}>{description}</Text>}
            </View>
            {children}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                </View>

                {/* Sync Status */}
                <Card variant="elevated" style={styles.syncCard}>
                    <View style={styles.syncContent}>
                        <View style={styles.syncInfo}>
                            <StatusBadge status={isOnline ? 'online' : 'offline'} />
                            {pendingSyncCount > 0 && (
                                <Badge variant="warning" size="sm" style={styles.syncBadge}>
                                    {pendingSyncCount} pending sync
                                </Badge>
                            )}
                        </View>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<RefreshCw size={16} color={VetColors.primary} />}
                            disabled={!isOnline || isSyncing}
                            onPress={handleSync}
                        >
                            {isSyncing ? 'Syncing...' : 'Sync Now'}
                        </Button>
                    </View>
                </Card>

                {/* Appearance */}
                <Text style={styles.sectionTitle}>Appearance</Text>
                <Card variant="default" style={styles.settingsCard}>
                    <SettingRow
                        icon={settings.darkMode ? <Moon size={20} color={VetColors.primary} /> : <Sun size={20} color={VetColors.warning} />}
                        label="Dark Mode"
                        description="Switch between light and dark themes"
                    >
                        <Switch
                            value={settings.darkMode}
                            onValueChange={(value) => handleToggle('darkMode', value)}
                            trackColor={{ false: VetColors.border, true: VetColors.primaryLight }}
                            thumbColor={settings.darkMode ? VetColors.primary : VetColors.background}
                        />
                    </SettingRow>

                    <View style={styles.divider} />

                    <SettingRow
                        icon={<Eye size={20} color={VetColors.secondary} />}
                        label="High Contrast Mode"
                        description="Improve visibility in bright environments"
                    >
                        <Switch
                            value={settings.highContrastMode}
                            onValueChange={(value) => handleToggle('highContrastMode', value)}
                            trackColor={{ false: VetColors.border, true: VetColors.secondaryLight }}
                            thumbColor={settings.highContrastMode ? VetColors.secondary : VetColors.background}
                        />
                    </SettingRow>
                </Card>

                {/* Behavior */}
                <Text style={styles.sectionTitle}>Behavior</Text>
                <Card variant="default" style={styles.settingsCard}>
                    <SettingRow
                        icon={<Vibrate size={20} color={VetColors.primary} />}
                        label="Haptic Feedback"
                        description="Vibration on button presses"
                    >
                        <Switch
                            value={settings.hapticFeedback}
                            onValueChange={(value) => handleToggle('hapticFeedback', value)}
                            trackColor={{ false: VetColors.border, true: VetColors.primaryLight }}
                            thumbColor={settings.hapticFeedback ? VetColors.primary : VetColors.background}
                        />
                    </SettingRow>

                    <View style={styles.divider} />

                    <SettingRow
                        icon={<Save size={20} color={VetColors.success} />}
                        label="Auto-save Calculations"
                        description="Automatically save calculation history"
                    >
                        <Switch
                            value={settings.autoSaveCalculations}
                            onValueChange={(value) => handleToggle('autoSaveCalculations', value)}
                            trackColor={{ false: VetColors.border, true: VetColors.successLight }}
                            thumbColor={settings.autoSaveCalculations ? VetColors.success : VetColors.background}
                        />
                    </SettingRow>
                </Card>

                {/* Safety */}
                <Text style={styles.sectionTitle}>Safety</Text>
                <Card variant="default" style={styles.settingsCard}>
                    <SettingRow
                        icon={<Shield size={20} color={VetColors.success} />}
                        label="Show Safety Warnings"
                        description="Display warnings for interactions and contraindications"
                    >
                        <Switch
                            value={settings.showSafetyWarnings}
                            onValueChange={(value) => handleToggle('showSafetyWarnings', value)}
                            trackColor={{ false: VetColors.border, true: VetColors.successLight }}
                            thumbColor={settings.showSafetyWarnings ? VetColors.success : VetColors.background}
                        />
                    </SettingRow>

                    <View style={styles.divider} />

                    <SettingRow
                        icon={<AlertTriangle size={20} color={VetColors.danger} />}
                        label="High-Risk Confirmation"
                        description="Require confirmation for high-risk medications"
                    >
                        <Switch
                            value={settings.requireConfirmationForHighRisk}
                            onValueChange={(value) => handleToggle('requireConfirmationForHighRisk', value)}
                            trackColor={{ false: VetColors.border, true: VetColors.dangerLight }}
                            thumbColor={settings.requireConfirmationForHighRisk ? VetColors.danger : VetColors.background}
                        />
                    </SettingRow>
                </Card>

                {/* Data */}
                <Text style={styles.sectionTitle}>Data</Text>
                <Card variant="default" style={styles.settingsCard}>
                    <Pressable style={styles.linkRow} onPress={() => setShowExportModal(true)}>
                        <View style={styles.linkIcon}>
                            <Database size={20} color={VetColors.primary} />
                        </View>
                        <View style={styles.linkContent}>
                            <Text style={styles.linkLabel}>Export Data</Text>
                            <Text style={styles.linkDescription}>Export patients and calculations</Text>
                        </View>
                        <ChevronRight size={20} color={VetColors.textMuted} />
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable style={styles.linkRow} onPress={() => setShowAboutModal(true)}>
                        <View style={styles.linkIcon}>
                            <Info size={20} color={VetColors.secondary} />
                        </View>
                        <View style={styles.linkContent}>
                            <Text style={styles.linkLabel}>About VetDose Pro</Text>
                            <Text style={styles.linkDescription}>Version 1.0.0</Text>
                        </View>
                        <ChevronRight size={20} color={VetColors.textMuted} />
                    </Pressable>
                </Card>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>VetDose Pro © 2026</Text>
                    <Text style={styles.footerSubtext}>
                        For veterinary professionals only
                    </Text>
                </View>
            </ScrollView>

            {/* About Modal */}
            <Modal visible={showAboutModal} transparent animationType="fade" onRequestClose={() => setShowAboutModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>About VetDose Pro</Text>
                            <Pressable onPress={() => setShowAboutModal(false)}>
                                <X size={24} color={VetColors.textSecondary} />
                            </Pressable>
                        </View>
                        <View style={styles.modalBody}>
                            <View style={styles.aboutLogo}>
                                <Text style={styles.aboutLogoText}>🐾</Text>
                            </View>
                            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
                            <Text style={styles.aboutDescription}>
                                VetDose Pro is a professional veterinary drug dosage calculator designed for veterinary professionals.
                            </Text>
                            <View style={styles.aboutFeatures}>
                                <View style={styles.featureItem}>
                                    <Check size={16} color={VetColors.success} />
                                    <Text style={styles.featureText}>Accurate drug dosing</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Check size={16} color={VetColors.success} />
                                    <Text style={styles.featureText}>Patient management</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Check size={16} color={VetColors.success} />
                                    <Text style={styles.featureText}>Offline support</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Check size={16} color={VetColors.success} />
                                    <Text style={styles.featureText}>Safety warnings</Text>
                                </View>
                            </View>
                        </View>
                        <Button variant="primary" fullWidth onPress={() => setShowAboutModal(false)}>
                            Close
                        </Button>
                    </View>
                </View>
            </Modal>

            {/* Export Modal */}
            <Modal visible={showExportModal} transparent animationType="fade" onRequestClose={() => setShowExportModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Export Data</Text>
                            <Pressable onPress={() => setShowExportModal(false)}>
                                <X size={24} color={VetColors.textSecondary} />
                            </Pressable>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.exportDescription}>
                                Export your data as a JSON file. This includes:
                            </Text>
                            <View style={styles.exportItems}>
                                <Text style={styles.exportItem}>• All patient records</Text>
                                <Text style={styles.exportItem}>• Calculation history</Text>
                                <Text style={styles.exportItem}>• Favorite drugs</Text>
                                <Text style={styles.exportItem}>• App settings</Text>
                            </View>
                        </View>
                        <View style={styles.exportActions}>
                            <Button variant="outline" onPress={() => setShowExportModal(false)} style={styles.exportButton}>
                                Cancel
                            </Button>
                            <Button variant="primary" onPress={handleExportData} style={styles.exportButton}>
                                Export
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: VetColors.backgroundSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        padding: Spacing.base,
        paddingTop: Spacing.lg,
    },
    title: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.bold,
        color: VetColors.text,
    },
    syncCard: {
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.lg,
    },
    syncContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    syncInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    syncBadge: {
        marginLeft: Spacing.sm,
    },
    sectionTitle: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: VetColors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: Spacing.base,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    settingsCard: {
        marginHorizontal: Spacing.base,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: VetColors.backgroundTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: VetColors.text,
    },
    settingDescription: {
        fontSize: Typography.sizes.sm,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: VetColors.border,
        marginLeft: 56,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    linkIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: VetColors.backgroundTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    linkContent: {
        flex: 1,
    },
    linkLabel: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: VetColors.text,
    },
    linkDescription: {
        fontSize: Typography.sizes.sm,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: Spacing['2xl'],
    },
    footerText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        color: VetColors.textSecondary,
    },
    footerSubtext: {
        fontSize: Typography.sizes.xs,
        color: VetColors.textMuted,
        marginTop: 4,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.base,
    },
    modalContent: {
        backgroundColor: VetColors.background,
        borderRadius: 20,
        padding: Spacing.lg,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    modalTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: VetColors.text,
    },
    modalBody: {
        marginBottom: Spacing.lg,
    },
    aboutLogo: {
        alignSelf: 'center',
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: VetColors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    aboutLogoText: {
        fontSize: 40,
    },
    aboutVersion: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: VetColors.primary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    aboutDescription: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    aboutFeatures: {
        gap: Spacing.sm,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    featureText: {
        fontSize: Typography.sizes.base,
        color: VetColors.text,
    },
    exportDescription: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
        marginBottom: Spacing.md,
    },
    exportItems: {
        gap: Spacing.xs,
    },
    exportItem: {
        fontSize: Typography.sizes.base,
        color: VetColors.text,
    },
    exportActions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    exportButton: {
        flex: 1,
    },
});
