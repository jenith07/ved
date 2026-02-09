import { useRouter } from 'expo-router';
import { AlertTriangle, ChevronRight, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Radius, Spacing, Typography, VetColors } from '@/constants/theme';
import { Badge, SafetyBadge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { NumericInput, SearchInput } from '@/src/components/ui/Input';

// Common toxins database
const COMMON_TOXINS = [
    {
        id: 'chocolate',
        name: 'Chocolate',
        icon: '🍫',
        toxicComponent: 'Theobromine',
        commonIn: ['canine', 'feline'],
    },
    {
        id: 'xylitol',
        name: 'Xylitol',
        icon: '🍬',
        toxicComponent: 'Xylitol (sugar substitute)',
        commonIn: ['canine'],
    },
    {
        id: 'ibuprofen',
        name: 'Ibuprofen',
        icon: '💊',
        toxicComponent: 'NSAID',
        commonIn: ['canine', 'feline'],
    },
    {
        id: 'grapes',
        name: 'Grapes/Raisins',
        icon: '🍇',
        toxicComponent: 'Unknown (nephrotoxic)',
        commonIn: ['canine'],
    },
    {
        id: 'rodenticide',
        name: 'Rodenticide',
        icon: '🐀',
        toxicComponent: 'Anticoagulant',
        commonIn: ['all'],
    },
    {
        id: 'acetaminophen',
        name: 'Acetaminophen',
        icon: '💊',
        toxicComponent: 'Paracetamol',
        commonIn: ['feline'],
    },
];

export default function ToxicityScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedToxin, setSelectedToxin] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [weight, setWeight] = useState('');
    const [showResult, setShowResult] = useState(false);

    const handleCalculate = () => {
        if (selectedToxin && amount && weight) {
            setShowResult(true);
        }
    };

    const filteredToxins = COMMON_TOXINS.filter((toxin) =>
        toxin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (showResult) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Emergency Result Header */}
                    <View style={styles.emergencyHeader}>
                        <AlertTriangle size={48} color={VetColors.emergency} />
                        <Text style={styles.emergencyTitle}>ASSESSMENT RESULT</Text>
                    </View>

                    {/* Severity Indicator */}
                    <Card
                        variant="elevated"
                        backgroundColor={VetColors.cardRed}
                        style={styles.severityCard}
                    >
                        <SafetyBadge level="danger" />
                        <Text style={styles.severityText}>
                            75% of toxic dose threshold
                        </Text>
                        <Text style={styles.severitySubtext}>
                            Immediate veterinary attention recommended
                        </Text>
                    </Card>

                    {/* Symptoms to Watch */}
                    <Text style={styles.sectionTitle}>Symptoms to Watch</Text>
                    <Card variant="default" style={styles.symptomsCard}>
                        {['Vomiting', 'Diarrhea', 'Hyperactivity', 'Increased heart rate', 'Seizures'].map((symptom) => (
                            <View key={symptom} style={styles.symptomRow}>
                                <View style={styles.symptomDot} />
                                <Text style={styles.symptomText}>{symptom}</Text>
                            </View>
                        ))}
                    </Card>

                    {/* Decontamination Protocol */}
                    <Text style={styles.sectionTitle}>Decontamination Protocol</Text>
                    <Card variant="elevated" style={styles.protocolCard}>
                        <View style={styles.protocolStep}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <Text style={styles.stepText}>
                                Induce vomiting if within 2 hours of ingestion (unless contraindicated)
                            </Text>
                        </View>
                        <View style={styles.protocolStep}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <Text style={styles.stepText}>
                                Administer activated charcoal (1-2 g/kg PO)
                            </Text>
                        </View>
                        <View style={styles.protocolStep}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <Text style={styles.stepText}>
                                Monitor for cardiac arrhythmias and CNS signs
                            </Text>
                        </View>
                    </Card>

                    <View style={styles.actions}>
                        <Button
                            variant="danger"
                            size="lg"
                            fullWidth
                            onPress={() => { }}
                        >
                            Find Emergency Vet
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            fullWidth
                            onPress={() => setShowResult(false)}
                        >
                            New Assessment
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Warning Banner */}
                <View style={styles.warningBanner}>
                    <AlertTriangle size={20} color={VetColors.warning} />
                    <Text style={styles.warningText}>
                        For emergencies, always contact a veterinarian immediately
                    </Text>
                </View>

                {/* Toxin Search */}
                <Text style={styles.sectionTitle}>What was ingested?</Text>
                <SearchInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search toxins..."
                    onClear={() => setSearchQuery('')}
                />

                {/* Common Toxins Grid */}
                <View style={styles.toxinsGrid}>
                    {filteredToxins.map((toxin) => {
                        const isSelected = selectedToxin === toxin.id;
                        return (
                            <Pressable
                                key={toxin.id}
                                style={[
                                    styles.toxinCard,
                                    isSelected && styles.toxinCardSelected,
                                ]}
                                onPress={() => setSelectedToxin(toxin.id)}
                            >
                                <Text style={styles.toxinIcon}>{toxin.icon}</Text>
                                <Text style={styles.toxinName}>{toxin.name}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                {selectedToxin && (
                    <>
                        {/* Amount Input */}
                        <Text style={styles.sectionTitle}>Amount Ingested</Text>
                        <NumericInput
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="Enter amount"
                            suffix="g"
                        />

                        {/* Weight Input */}
                        <Text style={styles.sectionTitle}>Patient Weight</Text>
                        <NumericInput
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="Enter weight"
                            suffix="kg"
                        />

                        {/* Time Since Ingestion */}
                        <View style={styles.timeRow}>
                            <Clock size={18} color={VetColors.textSecondary} />
                            <Text style={styles.timeLabel}>Time since ingestion:</Text>
                            <Badge variant="warning">Within 2 hours</Badge>
                        </View>

                        {/* Calculate Button */}
                        <Button
                            variant="emergency"
                            size="lg"
                            fullWidth
                            disabled={!amount || !weight}
                            onPress={handleCalculate}
                            style={styles.calculateButton}
                        >
                            Calculate Toxicity
                        </Button>
                    </>
                )}

                {/* Quick Links */}
                <Text style={styles.sectionTitle}>Quick Reference</Text>
                <Card
                    variant="default"
                    pressable
                    onPress={() => router.push('/emergency/antidotes')}
                    style={styles.quickLink}
                >
                    <Text style={styles.quickLinkText}>Antidote Reference Guide</Text>
                    <ChevronRight size={20} color={VetColors.textMuted} />
                </Card>
                <Card
                    variant="default"
                    pressable
                    onPress={() => router.push('/emergency/cpr-reference')}
                    style={styles.quickLink}
                >
                    <Text style={styles.quickLinkText}>CPR Protocols</Text>
                    <ChevronRight size={20} color={VetColors.textMuted} />
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
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: VetColors.cardOrange,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    warningText: {
        flex: 1,
        fontSize: Typography.sizes.sm,
        color: VetColors.warningDark,
        fontWeight: Typography.weights.medium,
    },
    sectionTitle: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
    },
    toxinsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
    toxinCard: {
        width: '30%',
        padding: Spacing.md,
        backgroundColor: VetColors.background,
        borderRadius: Radius.lg,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: VetColors.border,
    },
    toxinCardSelected: {
        borderColor: VetColors.emergency,
        backgroundColor: VetColors.cardRed,
    },
    toxinIcon: {
        fontSize: 32,
        marginBottom: Spacing.xs,
    },
    toxinName: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        color: VetColors.text,
        textAlign: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
    },
    timeLabel: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
    },
    calculateButton: {
        marginTop: Spacing.xl,
    },
    quickLink: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    quickLinkText: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: VetColors.text,
    },
    // Result styles
    emergencyHeader: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    emergencyTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: VetColors.emergency,
        marginTop: Spacing.md,
    },
    severityCard: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    severityText: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: VetColors.danger,
        marginTop: Spacing.md,
    },
    severitySubtext: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
        marginTop: Spacing.xs,
    },
    symptomsCard: {
        marginBottom: Spacing.lg,
    },
    symptomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    symptomDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: VetColors.danger,
        marginRight: Spacing.md,
    },
    symptomText: {
        fontSize: Typography.sizes.base,
        color: VetColors.text,
    },
    protocolCard: {
        marginBottom: Spacing.xl,
    },
    protocolStep: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: Spacing.md,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: VetColors.emergency,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    stepNumberText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.bold,
        color: VetColors.textInverse,
    },
    stepText: {
        flex: 1,
        fontSize: Typography.sizes.base,
        color: VetColors.text,
        lineHeight: 22,
    },
    actions: {
        gap: Spacing.md,
    },
});
