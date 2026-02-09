import { AlertCircle, Syringe } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography, VetColors } from '@/constants/theme';
import { Badge } from '@/src/components/ui/Badge';
import { Card } from '@/src/components/ui/Card';
import { SearchInput } from '@/src/components/ui/Input';

const ANTIDOTES = [
    {
        id: '1',
        toxin: 'Anticoagulant Rodenticides',
        antidote: 'Vitamin K1 (Phytonadione)',
        dose: '2.5-5 mg/kg PO divided BID-TID',
        duration: '3-6 weeks depending on generation',
        notes: 'Continue 48-72h past normalization of PT',
    },
    {
        id: '2',
        toxin: 'Organophosphates/Carbamates',
        antidote: 'Atropine Sulfate',
        dose: '0.2-0.5 mg/kg IV (1/4 IV, rest IM/SC)',
        duration: 'Repeat as needed for secretions',
        notes: 'Also give 2-PAM for organophosphates',
    },
    {
        id: '3',
        toxin: 'Acetaminophen (Cats)',
        antidote: 'N-Acetylcysteine (NAC)',
        dose: '140 mg/kg PO/IV loading, then 70 mg/kg q4-6h',
        duration: 'Minimum 7 doses',
        notes: 'Most effective within 8-10 hours',
    },
    {
        id: '4',
        toxin: 'Opioid Overdose',
        antidote: 'Naloxone',
        dose: '0.01-0.04 mg/kg IV/IM/SC',
        duration: 'May repeat q2-3 min',
        notes: 'Short duration - may need repeat doses',
    },
    {
        id: '5',
        toxin: 'Ethylene Glycol',
        antidote: 'Fomepizole (4-MP) or Ethanol',
        dose: 'Fomepizole: 20 mg/kg IV initially (dogs)',
        duration: 'Continue until levels undetectable',
        notes: 'Must treat within 8-12 hours',
    },
    {
        id: '6',
        toxin: 'Lead Toxicosis',
        antidote: 'CaEDTA or Succimer',
        dose: 'CaEDTA: 25 mg/kg SC q6h x 5 days',
        duration: '5 day courses with 5-day rest',
        notes: 'Remove source first!',
    },
];

export default function AntidotesScreen() {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredAntidotes = ANTIDOTES.filter(
        (item) =>
            item.toxin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.antidote.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <SearchInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search toxin or antidote..."
                    onClear={() => setSearchQuery('')}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Warning */}
                <View style={styles.warning}>
                    <AlertCircle size={18} color={VetColors.warning} />
                    <Text style={styles.warningText}>
                        Always confirm doses with current references. This is a quick reference guide only.
                    </Text>
                </View>

                {/* Antidote List */}
                {filteredAntidotes.map((item) => (
                    <Card key={item.id} variant="elevated" style={styles.antidoteCard}>
                        <View style={styles.antidoteHeader}>
                            <View style={styles.toxinIcon}>
                                <Syringe size={20} color={VetColors.primary} />
                            </View>
                            <View style={styles.toxinInfo}>
                                <Text style={styles.toxinName}>{item.toxin}</Text>
                                <Badge variant="success" size="sm">
                                    {item.antidote}
                                </Badge>
                            </View>
                        </View>

                        <View style={styles.doseSection}>
                            <Text style={styles.doseLabel}>Dose:</Text>
                            <Text style={styles.doseValue}>{item.dose}</Text>
                        </View>

                        <View style={styles.doseSection}>
                            <Text style={styles.doseLabel}>Duration:</Text>
                            <Text style={styles.doseValue}>{item.duration}</Text>
                        </View>

                        {item.notes && (
                            <View style={styles.notesSection}>
                                <AlertCircle size={14} color={VetColors.warning} />
                                <Text style={styles.notesText}>{item.notes}</Text>
                            </View>
                        )}
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: VetColors.backgroundSecondary,
    },
    searchContainer: {
        padding: Spacing.base,
        backgroundColor: VetColors.background,
    },
    scrollContent: {
        padding: Spacing.base,
        paddingBottom: Spacing['3xl'],
    },
    warning: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
    },
    antidoteCard: {
        marginBottom: Spacing.md,
    },
    antidoteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    toxinIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: VetColors.cardPurple,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    toxinInfo: {
        flex: 1,
    },
    toxinName: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
        marginBottom: Spacing.xs,
    },
    doseSection: {
        flexDirection: 'row',
        paddingVertical: Spacing.xs,
    },
    doseLabel: {
        width: 70,
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        color: VetColors.textSecondary,
    },
    doseValue: {
        flex: 1,
        fontSize: Typography.sizes.sm,
        color: VetColors.text,
    },
    notesSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: VetColors.cardOrange,
        padding: Spacing.sm,
        borderRadius: Radius.md,
        marginTop: Spacing.sm,
        gap: Spacing.sm,
    },
    notesText: {
        flex: 1,
        fontSize: Typography.sizes.sm,
        color: VetColors.warningDark,
    },
});
