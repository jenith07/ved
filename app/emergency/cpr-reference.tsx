import { AlertTriangle, Clock, Heart } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography, VetColors } from '@/constants/theme';
import { Badge } from '@/src/components/ui/Badge';
import { Card } from '@/src/components/ui/Card';

const CPR_PROTOCOLS = [
    {
        species: 'Canine',
        chest: 'Lateral recumbency, compress at widest part of chest',
        rate: '100-120 compressions/min',
        depth: '1/3 to 1/2 chest width',
        breathRatio: '30:2 (compressions:breaths)',
        drugs: [
            { name: 'Epinephrine', dose: '0.01-0.02 mg/kg IV q3-5min' },
            { name: 'Atropine', dose: '0.04 mg/kg IV (if bradycardia)' },
            { name: 'Vasopressin', dose: '0.8 U/kg IV (alternative to 1st epi)' },
        ],
    },
    {
        species: 'Feline',
        chest: 'Lateral or sternal, cardiac pump technique',
        rate: '100-120 compressions/min',
        depth: '1/3 to 1/2 chest width',
        breathRatio: '30:2 (compressions:breaths)',
        drugs: [
            { name: 'Epinephrine', dose: '0.01-0.02 mg/kg IV q3-5min' },
            { name: 'Atropine', dose: '0.04 mg/kg IV (if bradycardia)' },
        ],
    },
];

export default function CPRReferenceScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Emergency Warning */}
                <View style={styles.emergencyBanner}>
                    <AlertTriangle size={24} color={VetColors.textInverse} />
                    <Text style={styles.emergencyText}>
                        Start CPR immediately if patient is unresponsive with no pulse
                    </Text>
                </View>

                {/* Quick Reference */}
                <Card variant="elevated" style={styles.quickCard}>
                    <View style={styles.quickHeader}>
                        <Heart size={24} color={VetColors.emergency} />
                        <Text style={styles.quickTitle}>CAB - Circulation, Airway, Breathing</Text>
                    </View>
                    <View style={styles.quickSteps}>
                        <View style={styles.quickStep}>
                            <Text style={styles.stepLetter}>C</Text>
                            <Text style={styles.stepDesc}>Start chest compressions immediately</Text>
                        </View>
                        <View style={styles.quickStep}>
                            <Text style={styles.stepLetter}>A</Text>
                            <Text style={styles.stepDesc}>Establish airway (intubate if possible)</Text>
                        </View>
                        <View style={styles.quickStep}>
                            <Text style={styles.stepLetter}>B</Text>
                            <Text style={styles.stepDesc}>Provide ventilation (10-12 breaths/min)</Text>
                        </View>
                    </View>
                </Card>

                {/* Timing */}
                <View style={styles.timingRow}>
                    <Clock size={18} color={VetColors.warning} />
                    <Text style={styles.timingText}>
                        Reassess every 2 minutes • Rotate compressors to prevent fatigue
                    </Text>
                </View>

                {/* Species-Specific Protocols */}
                {CPR_PROTOCOLS.map((protocol) => (
                    <Card key={protocol.species} variant="default" style={styles.protocolCard}>
                        <View style={styles.protocolHeader}>
                            <Badge variant="primary" size="lg">
                                {protocol.species}
                            </Badge>
                        </View>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Position</Text>
                                <Text style={styles.infoValue}>{protocol.chest}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Rate</Text>
                                <Text style={styles.infoValueHighlight}>{protocol.rate}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Depth</Text>
                                <Text style={styles.infoValue}>{protocol.depth}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Ratio</Text>
                                <Text style={styles.infoValueHighlight}>{protocol.breathRatio}</Text>
                            </View>
                        </View>

                        <Text style={styles.drugsTitle}>Emergency Drugs</Text>
                        {protocol.drugs.map((drug) => (
                            <View key={drug.name} style={styles.drugRow}>
                                <Text style={styles.drugName}>{drug.name}</Text>
                                <Text style={styles.drugDose}>{drug.dose}</Text>
                            </View>
                        ))}
                    </Card>
                ))}

                {/* ROSC Signs */}
                <Card variant="elevated" backgroundColor={VetColors.cardGreen} style={styles.roscCard}>
                    <Text style={styles.roscTitle}>Signs of ROSC (Return of Spontaneous Circulation)</Text>
                    <View style={styles.roscList}>
                        {[
                            'Palpable pulse',
                            'ETCO2 > 15-20 mmHg (sudden increase)',
                            'Spontaneous breathing',
                            'Reactive pupils',
                            'Movement',
                        ].map((sign) => (
                            <View key={sign} style={styles.roscItem}>
                                <View style={styles.roscDot} />
                                <Text style={styles.roscText}>{sign}</Text>
                            </View>
                        ))}
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: VetColors.backgroundSecondary,
    },
    scrollContent: {
        padding: Spacing.base,
        paddingBottom: Spacing['3xl'],
    },
    emergencyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: VetColors.emergency,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        marginBottom: Spacing.lg,
        gap: Spacing.md,
    },
    emergencyText: {
        flex: 1,
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.semibold,
        color: VetColors.textInverse,
    },
    quickCard: {
        marginBottom: Spacing.lg,
    },
    quickHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    quickTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: VetColors.text,
    },
    quickSteps: {
        gap: Spacing.md,
    },
    quickStep: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    stepLetter: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: VetColors.emergency,
        color: VetColors.textInverse,
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        textAlign: 'center',
        lineHeight: 32,
        overflow: 'hidden',
    },
    stepDesc: {
        flex: 1,
        fontSize: Typography.sizes.base,
        color: VetColors.text,
    },
    timingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: VetColors.cardOrange,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    timingText: {
        flex: 1,
        fontSize: Typography.sizes.sm,
        color: VetColors.warningDark,
    },
    protocolCard: {
        marginBottom: Spacing.lg,
    },
    protocolHeader: {
        marginBottom: Spacing.md,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    infoItem: {
        width: '47%',
        backgroundColor: VetColors.backgroundSecondary,
        padding: Spacing.sm,
        borderRadius: Radius.md,
    },
    infoLabel: {
        fontSize: Typography.sizes.xs,
        color: VetColors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: Typography.sizes.sm,
        color: VetColors.text,
    },
    infoValueHighlight: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.bold,
        color: VetColors.emergency,
    },
    drugsTitle: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: VetColors.textSecondary,
        textTransform: 'uppercase',
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    drugRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: VetColors.border,
    },
    drugName: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: VetColors.text,
    },
    drugDose: {
        fontSize: Typography.sizes.sm,
        color: VetColors.textSecondary,
    },
    roscCard: {
        marginTop: Spacing.md,
    },
    roscTitle: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: VetColors.successDark,
        marginBottom: Spacing.md,
    },
    roscList: {
        gap: Spacing.sm,
    },
    roscItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    roscDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: VetColors.success,
    },
    roscText: {
        fontSize: Typography.sizes.base,
        color: VetColors.text,
    },
});
