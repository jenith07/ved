import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bird,
    Cat,
    Check,
    ChevronRight,
    Dog,
    Squirrel,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, Shadows, Spacing, Typography, VetColors } from '@/constants/theme';
import { Badge, SafetyBadge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { LargeNumericInput, SearchInput } from '@/src/components/ui/Input';
import { BCSSlider } from '@/src/components/ui/Slider';
import { useAppStore } from '@/src/store/useAppStore';
import { useCalculatorStore } from '@/src/store/useCalculatorStore';
import type { Species } from '@/src/types';
import { SPECIES_CONFIG } from '@/src/types/species';

// Calculator steps
type CalculatorStep = 'species' | 'weight' | 'drug' | 'result';

export default function CalculatorScreen() {
    const router = useRouter();
    const { settings } = useAppStore();
    const {
        species: selectedSpecies,
        setSpecies: setSelectedSpecies,
        weight,
        setWeight,
        weightUnit,
        bcs,
        setBcs,
        selectedDrug,
        result,
        calculate,
        resetCalculator,
    } = useCalculatorStore();

    const [currentStep, setCurrentStep] = useState<CalculatorStep>('species');
    const [weightInput, setWeightInput] = useState('');
    const [drugSearch, setDrugSearch] = useState('');

    const handleSpeciesSelect = (species: Species) => {
        if (settings.hapticFeedback) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSelectedSpecies(species);
        setCurrentStep('weight');
    };

    const handleWeightNext = () => {
        const weightValue = parseFloat(weightInput);
        if (weightValue > 0) {
            setWeight(weightValue, weightUnit);
            setCurrentStep('drug');
        }
    };

    const handleBack = () => {
        switch (currentStep) {
            case 'weight':
                setCurrentStep('species');
                break;
            case 'drug':
                setCurrentStep('weight');
                break;
            case 'result':
                setCurrentStep('drug');
                break;
        }
    };

    const handleReset = () => {
        resetCalculator();
        setWeightInput('');
        setDrugSearch('');
        setCurrentStep('species');
    };

    const speciesConfig = selectedSpecies ? SPECIES_CONFIG[selectedSpecies] : null;

    // Render species selection step
    const renderSpeciesStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Species</Text>
            <Text style={styles.stepSubtitle}>Choose the animal type for accurate dosing</Text>

            <View style={styles.speciesGrid}>
                {Object.values(SPECIES_CONFIG).map((config) => {
                    const isSelected = selectedSpecies === config.id;
                    const IconComponent = getSpeciesIcon(config.id);

                    return (
                        <Pressable
                            key={config.id}
                            style={[
                                styles.speciesCard,
                                isSelected && styles.speciesCardSelected,
                                { backgroundColor: `${config.color}15` },
                            ]}
                            onPress={() => handleSpeciesSelect(config.id)}
                        >
                            <View style={[styles.speciesIconContainer, { backgroundColor: config.color }]}>
                                <IconComponent size={28} color={VetColors.textInverse} />
                            </View>
                            <Text style={[styles.speciesName, isSelected && { color: config.color }]}>
                                {config.name}
                            </Text>
                            {isSelected && (
                                <View style={[styles.checkMark, { backgroundColor: config.color }]}>
                                    <Check size={12} color={VetColors.textInverse} />
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );

    // Render weight input step
    const renderWeightStep = () => (
        <View style={styles.stepContainer}>
            <Pressable style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={24} color={VetColors.text} />
                <Text style={styles.backText}>Back</Text>
            </Pressable>

            <View style={styles.selectedSpeciesBadge}>
                {speciesConfig && (
                    <Badge variant="primary" rounded>
                        {speciesConfig.name}
                    </Badge>
                )}
            </View>

            <Text style={styles.stepTitle}>Enter Weight</Text>
            <Text style={styles.stepSubtitle}>Patient body weight for dose calculation</Text>

            <LargeNumericInput
                value={weightInput}
                onChangeText={setWeightInput}
                unit={weightUnit}
                alternateUnit={weightUnit === 'kg' ? 'lbs' : 'kg'}
                onUnitToggle={() => setWeight(parseFloat(weightInput) || 0, weightUnit === 'kg' ? 'lbs' : 'kg')}
                style={styles.weightInput}
            />

            <BCSSlider
                value={bcs ?? 5}
                onChange={setBcs}
                species={speciesConfig?.bcsScale.max === 5 ? 'avian' : 'standard'}
                style={styles.bcsSlider}
            />

            <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={!weightInput || parseFloat(weightInput) <= 0}
                onPress={handleWeightNext}
            >
                Continue to Drug Selection
            </Button>
        </View>
    );

    // Render drug selection step
    const renderDrugStep = () => (
        <View style={styles.stepContainer}>
            <Pressable style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={24} color={VetColors.text} />
                <Text style={styles.backText}>Back</Text>
            </Pressable>

            <View style={styles.patientSummary}>
                {speciesConfig && (
                    <Badge variant="primary" rounded>
                        {speciesConfig.name}
                    </Badge>
                )}
                <Badge variant="secondary" rounded>
                    {weight} {weightUnit}
                </Badge>
                <Badge variant="success" rounded>
                    BCS {bcs}/9
                </Badge>
            </View>

            <Text style={styles.stepTitle}>Select Drug</Text>
            <Text style={styles.stepSubtitle}>Search for medication by name</Text>

            <SearchInput
                value={drugSearch}
                onChangeText={setDrugSearch}
                placeholder="Search drugs (e.g., Amoxicillin)"
                onClear={() => setDrugSearch('')}
            />

            <View style={styles.drugCategories}>
                <Text style={styles.categoryTitle}>Common Drugs</Text>
                {/* Placeholder drug cards */}
                {['Amoxicillin', 'Carprofen', 'Metronidazole', 'Doxycycline'].map((drug) => (
                    <Card
                        key={drug}
                        variant="default"
                        pressable
                        onPress={() => {
                            // TODO: Implement drug selection
                            setCurrentStep('result');
                        }}
                        style={styles.drugCard}
                    >
                        <View style={styles.drugCardContent}>
                            <View>
                                <Text style={styles.drugName}>{drug}</Text>
                                <Text style={styles.drugCategory}>Antibiotic</Text>
                            </View>
                            <ChevronRight size={20} color={VetColors.textMuted} />
                        </View>
                    </Card>
                ))}
            </View>
        </View>
    );

    // Render result step
    const renderResultStep = () => (
        <View style={styles.stepContainer}>
            <View style={styles.resultHeader}>
                <Text style={styles.stepTitle}>Calculation Result</Text>
                <SafetyBadge level="safe" />
            </View>

            <Card variant="gradient" gradientColors={[VetColors.gradientGreenStart, VetColors.gradientGreenEnd]} style={styles.resultCard}>
                <Text style={styles.resultLabel}>Recommended Dose</Text>
                <Text style={styles.resultDose}>250 mg</Text>
                <Text style={styles.resultFrequency}>Every 12 hours (BID)</Text>
            </Card>

            <Card variant="elevated" style={styles.detailsCard}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Drug</Text>
                    <Text style={styles.detailValue}>Amoxicillin</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Dose Rate</Text>
                    <Text style={styles.detailValue}>10 mg/kg</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Patient Weight</Text>
                    <Text style={styles.detailValue}>{weight} {weightUnit}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Route</Text>
                    <Text style={styles.detailValue}>Oral (PO)</Text>
                </View>
            </Card>

            <View style={styles.resultActions}>
                <Button variant="outline" onPress={handleReset} style={styles.actionButton}>
                    New Calculation
                </Button>
                <Button variant="primary" onPress={() => { }} style={styles.actionButton}>
                    Save to Patient
                </Button>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Step Indicator */}
                <View style={styles.stepIndicator}>
                    {['species', 'weight', 'drug', 'result'].map((step, index) => (
                        <View key={step} style={styles.stepIndicatorItem}>
                            <View
                                style={[
                                    styles.stepDot,
                                    currentStep === step && styles.stepDotActive,
                                    ['species', 'weight', 'drug', 'result'].indexOf(currentStep) > index && styles.stepDotCompleted,
                                ]}
                            >
                                {['species', 'weight', 'drug', 'result'].indexOf(currentStep) > index && (
                                    <Check size={12} color={VetColors.textInverse} />
                                )}
                            </View>
                            {index < 3 && (
                                <View
                                    style={[
                                        styles.stepLine,
                                        ['species', 'weight', 'drug', 'result'].indexOf(currentStep) > index && styles.stepLineCompleted,
                                    ]}
                                />
                            )}
                        </View>
                    ))}
                </View>

                {currentStep === 'species' && renderSpeciesStep()}
                {currentStep === 'weight' && renderWeightStep()}
                {currentStep === 'drug' && renderDrugStep()}
                {currentStep === 'result' && renderResultStep()}
            </ScrollView>
        </SafeAreaView>
    );
}

// Helper function to get species icon
function getSpeciesIcon(species: Species) {
    switch (species) {
        case 'canine':
            return Dog;
        case 'feline':
            return Cat;
        case 'avian':
            return Bird;
        case 'exotic':
            return Squirrel;
        default:
            return Dog;
    }
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
        padding: Spacing.base,
        paddingBottom: 120, // Extra space for floating tab bar
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.xl,
    },
    stepIndicatorItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: VetColors.backgroundTertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDotActive: {
        backgroundColor: VetColors.primary,
        ...Shadows.sm,
    },
    stepDotCompleted: {
        backgroundColor: VetColors.success,
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: VetColors.backgroundTertiary,
        marginHorizontal: 4,
    },
    stepLineCompleted: {
        backgroundColor: VetColors.success,
    },
    stepContainer: {
        flex: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    backText: {
        fontSize: Typography.sizes.base,
        color: VetColors.text,
        marginLeft: Spacing.sm,
    },
    selectedSpeciesBadge: {
        marginBottom: Spacing.md,
    },
    stepTitle: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.bold,
        color: VetColors.text,
        marginBottom: Spacing.xs,
    },
    stepSubtitle: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
        marginBottom: Spacing.xl,
    },
    speciesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    speciesCard: {
        width: '47%',
        padding: Spacing.base,
        borderRadius: Radius.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    speciesCardSelected: {
        borderColor: VetColors.primary,
        ...Shadows.md,
    },
    speciesIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    speciesName: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
    },
    checkMark: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weightInput: {
        marginBottom: Spacing.lg,
    },
    bcsSlider: {
        marginBottom: Spacing.xl,
    },
    patientSummary: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
        flexWrap: 'wrap',
    },
    drugCategories: {
        marginTop: Spacing.lg,
    },
    categoryTitle: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
        marginBottom: Spacing.md,
    },
    drugCard: {
        marginBottom: Spacing.sm,
    },
    drugCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    drugName: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: VetColors.text,
    },
    drugCategory: {
        fontSize: Typography.sizes.sm,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    resultCard: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    resultLabel: {
        fontSize: Typography.sizes.base,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: Spacing.xs,
    },
    resultDose: {
        fontSize: Typography.sizes['4xl'],
        fontWeight: Typography.weights.bold,
        color: VetColors.textInverse,
        marginBottom: Spacing.xs,
    },
    resultFrequency: {
        fontSize: Typography.sizes.base,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    detailsCard: {
        marginBottom: Spacing.lg,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: VetColors.border,
    },
    detailLabel: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
    },
    detailValue: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: VetColors.text,
    },
    resultActions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    actionButton: {
        flex: 1,
    },
});
