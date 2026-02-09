/**
 * Drug Detail Screen
 * Shows complete drug information with dosages and formulations
 */
import { Radius, Spacing, VetColors } from '@/constants/theme';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    AlertTriangle,
    ArrowLeft,
    Beaker,
    ChevronRight,
    Clock,
    Heart,
    Info,
    Pill,
    Shield,
    Syringe,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/src/components/ui';
import { useAppStore } from '@/src/store/useAppStore';

// Mock drug data (will be replaced with database query)
const MOCK_DRUG = {
    id: '1',
    genericName: 'Amoxicillin',
    brandNames: ['Amoxi-Tabs', 'Amoxi-Drops', 'Biomox'],
    category: 'Antibiotic',
    drugClass: 'Beta-lactam',
    description: 'Broad-spectrum antibiotic effective against gram-positive and some gram-negative bacteria. Commonly used for skin, respiratory, and urinary tract infections.',
    mechanismOfAction: 'Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins.',
    isControlled: false,
    isHighRisk: false,
    mdr1Sensitive: false,
    pregnancyRisk: 'Generally safe',
    dosages: [
        { species: 'Canine', indication: 'General infection', route: 'PO', doseLow: 10, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        { species: 'Canine', indication: 'UTI', route: 'PO', doseLow: 15, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', duration: '7-14 days', safetyLevel: 'safe' },
        { species: 'Feline', indication: 'General infection', route: 'PO', doseLow: 10, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
    ],
    formulations: [
        { form: 'Tablet', concentration: 100, concentrationUnit: 'mg/tablet' },
        { form: 'Tablet', concentration: 250, concentrationUnit: 'mg/tablet' },
        { form: 'Tablet', concentration: 500, concentrationUnit: 'mg/tablet' },
        { form: 'Liquid', concentration: 50, concentrationUnit: 'mg/ml' },
    ],
    interactions: [
        { drug: 'Methotrexate', severity: 'moderate', description: 'May increase methotrexate levels' },
        { drug: 'Warfarin', severity: 'minor', description: 'May enhance anticoagulant effect' },
    ],
    contraindications: ['Penicillin allergy', 'Previous anaphylaxis to beta-lactams'],
    sideEffects: ['GI upset', 'Diarrhea', 'Allergic reactions', 'Rash'],
};

export default function DrugDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { favoriteDrugIds, toggleFavoriteDrug } = useAppStore();
    const [drug, setDrug] = useState<typeof MOCK_DRUG | null>(null);
    const [loading, setLoading] = useState(true);

    const isFavorite = favoriteDrugIds.includes(id || '');

    useEffect(() => {
        // Simulate loading drug from database
        setTimeout(() => {
            setDrug(MOCK_DRUG);
            setLoading(false);
        }, 300);
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={VetColors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (!drug) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Drug not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const getSafetyColor = (level: string) => {
        switch (level) {
            case 'safe': return VetColors.success;
            case 'caution': return VetColors.warning;
            case 'danger': return VetColors.danger;
            default: return VetColors.textMuted;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'minor': return VetColors.success;
            case 'moderate': return VetColors.warning;
            case 'major': return VetColors.danger;
            case 'contraindicated': return VetColors.emergency;
            default: return VetColors.textMuted;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTransparent: true,
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()} style={styles.headerButton}>
                            <ArrowLeft size={24} color={VetColors.text} />
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable
                            onPress={() => toggleFavoriteDrug(id || '')}
                            style={styles.headerButton}
                        >
                            <Heart
                                size={24}
                                color={isFavorite ? VetColors.danger : VetColors.textMuted}
                                fill={isFavorite ? VetColors.danger : 'transparent'}
                            />
                        </Pressable>
                    ),
                }}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.drugIcon}>
                        <Pill size={32} color={VetColors.primary} />
                    </View>
                    <Text style={styles.genericName}>{drug.genericName}</Text>
                    <Text style={styles.brandNames}>{drug.brandNames.join(' • ')}</Text>

                    <View style={styles.badges}>
                        <Badge variant="category" size="medium">{drug.category}</Badge>
                        {drug.isControlled && (
                            <Badge variant="danger" size="medium">Controlled</Badge>
                        )}
                        {drug.isHighRisk && (
                            <Badge variant="danger" size="medium">High Risk</Badge>
                        )}
                        {drug.mdr1Sensitive && (
                            <Badge variant="warning" size="medium">MDR1 Sensitive</Badge>
                        )}
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Info size={20} color={VetColors.primary} />
                        <Text style={styles.sectionTitle}>Description</Text>
                    </View>
                    <Text style={styles.description}>{drug.description}</Text>
                    {drug.drugClass && (
                        <Text style={styles.drugClass}>
                            <Text style={styles.label}>Drug Class: </Text>{drug.drugClass}
                        </Text>
                    )}
                    {drug.mechanismOfAction && (
                        <Text style={styles.mechanism}>
                            <Text style={styles.label}>Mechanism: </Text>{drug.mechanismOfAction}
                        </Text>
                    )}
                </View>

                {/* Dosages */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Syringe size={20} color={VetColors.primary} />
                        <Text style={styles.sectionTitle}>Dosages</Text>
                    </View>
                    {drug.dosages.map((dosage, index) => (
                        <View key={index} style={styles.dosageCard}>
                            <View style={styles.dosageHeader}>
                                <Badge variant="species" size="small">{dosage.species}</Badge>
                                <View style={[styles.safetyDot, { backgroundColor: getSafetyColor(dosage.safetyLevel) }]} />
                            </View>
                            <Text style={styles.indication}>{dosage.indication}</Text>
                            <View style={styles.dosageInfo}>
                                <View style={styles.dosageItem}>
                                    <Text style={styles.dosageLabel}>Dose</Text>
                                    <Text style={styles.dosageValue}>
                                        {dosage.doseLow === dosage.doseHigh
                                            ? `${dosage.doseLow} ${dosage.doseUnit}`
                                            : `${dosage.doseLow}-${dosage.doseHigh} ${dosage.doseUnit}`
                                        }
                                    </Text>
                                </View>
                                <View style={styles.dosageItem}>
                                    <Text style={styles.dosageLabel}>Route</Text>
                                    <Text style={styles.dosageValue}>{dosage.route}</Text>
                                </View>
                                <View style={styles.dosageItem}>
                                    <Text style={styles.dosageLabel}>Frequency</Text>
                                    <Text style={styles.dosageValue}>{dosage.frequency}</Text>
                                </View>
                            </View>
                            {dosage.duration && (
                                <View style={styles.durationRow}>
                                    <Clock size={14} color={VetColors.textSecondary} />
                                    <Text style={styles.duration}>{dosage.duration}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Formulations */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Beaker size={20} color={VetColors.primary} />
                        <Text style={styles.sectionTitle}>Available Formulations</Text>
                    </View>
                    <View style={styles.formulationsGrid}>
                        {drug.formulations.map((form, index) => (
                            <View key={index} style={styles.formulationCard}>
                                <Text style={styles.formulationForm}>{form.form}</Text>
                                <Text style={styles.formulationConc}>
                                    {form.concentration} {form.concentrationUnit}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Interactions */}
                {drug.interactions.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <AlertTriangle size={20} color={VetColors.warning} />
                            <Text style={styles.sectionTitle}>Drug Interactions</Text>
                        </View>
                        {drug.interactions.map((interaction, index) => (
                            <View key={index} style={styles.interactionCard}>
                                <View style={styles.interactionHeader}>
                                    <Text style={styles.interactionDrug}>{interaction.drug}</Text>
                                    <Badge
                                        variant={interaction.severity === 'minor' ? 'success' : 'warning'}
                                        size="small"
                                    >
                                        {interaction.severity}
                                    </Badge>
                                </View>
                                <Text style={styles.interactionDesc}>{interaction.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Contraindications */}
                {drug.contraindications.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Shield size={20} color={VetColors.danger} />
                            <Text style={styles.sectionTitle}>Contraindications</Text>
                        </View>
                        {drug.contraindications.map((item, index) => (
                            <View key={index} style={styles.listItem}>
                                <View style={styles.bulletDanger} />
                                <Text style={styles.listText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Side Effects */}
                {drug.sideEffects.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Info size={20} color={VetColors.textSecondary} />
                            <Text style={styles.sectionTitle}>Side Effects</Text>
                        </View>
                        <View style={styles.sideEffectsGrid}>
                            {drug.sideEffects.map((effect, index) => (
                                <View key={index} style={styles.sideEffectChip}>
                                    <Text style={styles.sideEffectText}>{effect}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Calculate Button */}
                <Pressable
                    style={styles.calculateButton}
                    onPress={() => router.push({
                        pathname: '/(tabs)/calculator',
                        params: { drugId: id }
                    })}
                >
                    <Text style={styles.calculateButtonText}>Calculate Dose</Text>
                    <ChevronRight size={20} color={VetColors.textInverse} />
                </Pressable>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: VetColors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: VetColors.textMuted,
    },
    scrollView: {
        flex: 1,
    },
    headerButton: {
        padding: Spacing.sm,
        marginHorizontal: Spacing.xs,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.lg,
    },
    drugIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: VetColors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    genericName: {
        fontSize: 28,
        fontWeight: '700',
        color: VetColors.text,
        textAlign: 'center',
    },
    brandNames: {
        fontSize: 14,
        color: VetColors.textSecondary,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.xs,
        marginTop: Spacing.md,
    },
    section: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: VetColors.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: VetColors.text,
    },
    description: {
        fontSize: 15,
        color: VetColors.textSecondary,
        lineHeight: 22,
    },
    drugClass: {
        fontSize: 14,
        color: VetColors.text,
        marginTop: Spacing.sm,
    },
    mechanism: {
        fontSize: 14,
        color: VetColors.text,
        marginTop: Spacing.xs,
    },
    label: {
        fontWeight: '600',
        color: VetColors.text,
    },
    dosageCard: {
        backgroundColor: VetColors.backgroundSecondary,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    dosageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    safetyDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    indication: {
        fontSize: 16,
        fontWeight: '600',
        color: VetColors.text,
        marginBottom: Spacing.sm,
    },
    dosageInfo: {
        flexDirection: 'row',
        gap: Spacing.lg,
    },
    dosageItem: {
        flex: 1,
    },
    dosageLabel: {
        fontSize: 12,
        color: VetColors.textMuted,
        marginBottom: 2,
    },
    dosageValue: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: VetColors.border,
    },
    duration: {
        fontSize: 13,
        color: VetColors.textSecondary,
    },
    formulationsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    formulationCard: {
        backgroundColor: VetColors.backgroundSecondary,
        borderRadius: Radius.md,
        padding: Spacing.md,
        minWidth: 100,
        alignItems: 'center',
    },
    formulationForm: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
    },
    formulationConc: {
        fontSize: 12,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    interactionCard: {
        backgroundColor: VetColors.cardYellow,
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    interactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    interactionDrug: {
        fontSize: 15,
        fontWeight: '600',
        color: VetColors.text,
    },
    interactionDesc: {
        fontSize: 13,
        color: VetColors.textSecondary,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    bulletDanger: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: VetColors.danger,
        marginTop: 6,
        marginRight: Spacing.sm,
    },
    listText: {
        flex: 1,
        fontSize: 14,
        color: VetColors.text,
    },
    sideEffectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    sideEffectChip: {
        backgroundColor: VetColors.backgroundTertiary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },
    sideEffectText: {
        fontSize: 13,
        color: VetColors.textSecondary,
    },
    calculateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: VetColors.primary,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: Radius.lg,
    },
    calculateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: VetColors.textInverse,
    },
    bottomSpacer: {
        height: 40,
    },
});
