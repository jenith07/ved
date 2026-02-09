/**
 * Medical History Component
 * Displays and manages patient conditions, allergies, and medications
 */
import { Radius, Spacing, VetColors } from '@/constants/theme';
import {
    AlertTriangle,
    Pill,
    Plus,
    Stethoscope,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import { Badge, Button } from '@/src/components/ui';

interface Condition {
    id: string;
    name: string;
    diagnosedAt?: number;
    status: 'active' | 'resolved' | 'chronic';
    notes?: string;
}

interface Allergy {
    id: string;
    allergen: string;
    reaction?: string;
    severity: 'mild' | 'moderate' | 'severe';
}

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate?: number;
    endDate?: number;
    active: boolean;
}

interface MedicalHistoryProps {
    conditions: Condition[];
    allergies: Allergy[];
    medications: Medication[];
    onAddCondition: (condition: Omit<Condition, 'id'>) => void;
    onAddAllergy: (allergy: Omit<Allergy, 'id'>) => void;
    onAddMedication: (medication: Omit<Medication, 'id'>) => void;
    onRemoveCondition: (id: string) => void;
    onRemoveAllergy: (id: string) => void;
    onRemoveMedication: (id: string) => void;
    editable?: boolean;
}

type AddModalType = 'condition' | 'allergy' | 'medication' | null;

export function MedicalHistory({
    conditions,
    allergies,
    medications,
    onAddCondition,
    onAddAllergy,
    onAddMedication,
    onRemoveCondition,
    onRemoveAllergy,
    onRemoveMedication,
    editable = true,
}: MedicalHistoryProps) {
    const [addModal, setAddModal] = useState<AddModalType>(null);
    const [newCondition, setNewCondition] = useState<{ name: string; status: 'active' | 'chronic' | 'resolved'; notes: string }>({ name: '', status: 'active', notes: '' });
    const [newAllergy, setNewAllergy] = useState<{ allergen: string; reaction: string; severity: 'mild' | 'moderate' | 'severe' }>({ allergen: '', reaction: '', severity: 'mild' });
    const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return VetColors.warning;
            case 'resolved': return VetColors.success;
            case 'chronic': return VetColors.primary;
            default: return VetColors.textMuted;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'mild': return VetColors.success;
            case 'moderate': return VetColors.warning;
            case 'severe': return VetColors.danger;
            default: return VetColors.textMuted;
        }
    };

    const handleAddCondition = () => {
        if (newCondition.name.trim()) {
            onAddCondition({
                name: newCondition.name.trim(),
                status: newCondition.status,
                notes: newCondition.notes.trim() || undefined,
                diagnosedAt: Date.now(),
            });
            setNewCondition({ name: '', status: 'active', notes: '' });
            setAddModal(null);
        }
    };

    const handleAddAllergy = () => {
        if (newAllergy.allergen.trim()) {
            onAddAllergy({
                allergen: newAllergy.allergen.trim(),
                reaction: newAllergy.reaction.trim() || undefined,
                severity: newAllergy.severity,
            });
            setNewAllergy({ allergen: '', reaction: '', severity: 'mild' });
            setAddModal(null);
        }
    };

    const handleAddMedication = () => {
        if (newMedication.name.trim()) {
            onAddMedication({
                name: newMedication.name.trim(),
                dosage: newMedication.dosage.trim(),
                frequency: newMedication.frequency.trim(),
                startDate: Date.now(),
                active: true,
            });
            setNewMedication({ name: '', dosage: '', frequency: '' });
            setAddModal(null);
        }
    };

    return (
        <View style={styles.container}>
            {/* Allergies Section - Always show first for safety */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <AlertTriangle size={20} color={VetColors.danger} />
                        <Text style={styles.sectionTitle}>Allergies</Text>
                    </View>
                    {editable && (
                        <Pressable
                            style={styles.addButton}
                            onPress={() => setAddModal('allergy')}
                        >
                            <Plus size={18} color={VetColors.primary} />
                        </Pressable>
                    )}
                </View>

                {allergies.length === 0 ? (
                    <Text style={styles.emptyText}>No known allergies</Text>
                ) : (
                    <View style={styles.itemsContainer}>
                        {allergies.map((allergy) => (
                            <View key={allergy.id} style={[styles.itemCard, styles.allergyCard]}>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemName}>{allergy.allergen}</Text>
                                    {allergy.reaction && (
                                        <Text style={styles.itemDetail}>{allergy.reaction}</Text>
                                    )}
                                </View>
                                <View style={styles.itemActions}>
                                    <Badge
                                        variant={allergy.severity === 'severe' ? 'danger' : allergy.severity === 'moderate' ? 'warning' : 'success'}
                                        size="small"
                                    >
                                        {allergy.severity}
                                    </Badge>
                                    {editable && (
                                        <Pressable
                                            style={styles.removeButton}
                                            onPress={() => onRemoveAllergy(allergy.id)}
                                        >
                                            <X size={16} color={VetColors.textMuted} />
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Conditions Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Stethoscope size={20} color={VetColors.primary} />
                        <Text style={styles.sectionTitle}>Conditions</Text>
                    </View>
                    {editable && (
                        <Pressable
                            style={styles.addButton}
                            onPress={() => setAddModal('condition')}
                        >
                            <Plus size={18} color={VetColors.primary} />
                        </Pressable>
                    )}
                </View>

                {conditions.length === 0 ? (
                    <Text style={styles.emptyText}>No conditions recorded</Text>
                ) : (
                    <View style={styles.itemsContainer}>
                        {conditions.map((condition) => (
                            <View key={condition.id} style={styles.itemCard}>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemName}>{condition.name}</Text>
                                    {condition.notes && (
                                        <Text style={styles.itemDetail}>{condition.notes}</Text>
                                    )}
                                </View>
                                <View style={styles.itemActions}>
                                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(condition.status) }]} />
                                    <Text style={styles.statusText}>{condition.status}</Text>
                                    {editable && (
                                        <Pressable
                                            style={styles.removeButton}
                                            onPress={() => onRemoveCondition(condition.id)}
                                        >
                                            <X size={16} color={VetColors.textMuted} />
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Medications Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Pill size={20} color={VetColors.secondary} />
                        <Text style={styles.sectionTitle}>Current Medications</Text>
                    </View>
                    {editable && (
                        <Pressable
                            style={styles.addButton}
                            onPress={() => setAddModal('medication')}
                        >
                            <Plus size={18} color={VetColors.primary} />
                        </Pressable>
                    )}
                </View>

                {medications.filter(m => m.active).length === 0 ? (
                    <Text style={styles.emptyText}>No current medications</Text>
                ) : (
                    <View style={styles.itemsContainer}>
                        {medications.filter(m => m.active).map((medication) => (
                            <View key={medication.id} style={styles.itemCard}>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemName}>{medication.name}</Text>
                                    <Text style={styles.itemDetail}>
                                        {medication.dosage} • {medication.frequency}
                                    </Text>
                                </View>
                                {editable && (
                                    <Pressable
                                        style={styles.removeButton}
                                        onPress={() => onRemoveMedication(medication.id)}
                                    >
                                        <X size={16} color={VetColors.textMuted} />
                                    </Pressable>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Add Condition Modal */}
            <Modal
                visible={addModal === 'condition'}
                transparent
                animationType="slide"
                onRequestClose={() => setAddModal(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Condition</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Condition name"
                            placeholderTextColor={VetColors.textMuted}
                            value={newCondition.name}
                            onChangeText={(text) => setNewCondition(prev => ({ ...prev, name: text }))}
                        />

                        <View style={styles.statusPicker}>
                            {(['active', 'chronic', 'resolved'] as const).map((status) => (
                                <Pressable
                                    key={status}
                                    style={[
                                        styles.statusOption,
                                        newCondition.status === status && styles.statusOptionActive,
                                    ]}
                                    onPress={() => setNewCondition(prev => ({ ...prev, status }))}
                                >
                                    <Text style={[
                                        styles.statusOptionText,
                                        newCondition.status === status && styles.statusOptionTextActive,
                                    ]}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <TextInput
                            style={[styles.input, styles.notesInput]}
                            placeholder="Notes (optional)"
                            placeholderTextColor={VetColors.textMuted}
                            value={newCondition.notes}
                            onChangeText={(text) => setNewCondition(prev => ({ ...prev, notes: text }))}
                            multiline
                        />

                        <View style={styles.modalButtons}>
                            <Button variant="secondary" onPress={() => setAddModal(null)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onPress={handleAddCondition}>
                                Add
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Allergy Modal */}
            <Modal
                visible={addModal === 'allergy'}
                transparent
                animationType="slide"
                onRequestClose={() => setAddModal(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Allergy</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Allergen (e.g., Penicillin)"
                            placeholderTextColor={VetColors.textMuted}
                            value={newAllergy.allergen}
                            onChangeText={(text) => setNewAllergy(prev => ({ ...prev, allergen: text }))}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Reaction (optional)"
                            placeholderTextColor={VetColors.textMuted}
                            value={newAllergy.reaction}
                            onChangeText={(text) => setNewAllergy(prev => ({ ...prev, reaction: text }))}
                        />

                        <Text style={styles.fieldLabel}>Severity</Text>
                        <View style={styles.statusPicker}>
                            {(['mild', 'moderate', 'severe'] as const).map((severity) => (
                                <Pressable
                                    key={severity}
                                    style={[
                                        styles.statusOption,
                                        newAllergy.severity === severity && styles.statusOptionActive,
                                        { borderColor: getSeverityColor(severity) },
                                    ]}
                                    onPress={() => setNewAllergy(prev => ({ ...prev, severity }))}
                                >
                                    <Text style={[
                                        styles.statusOptionText,
                                        newAllergy.severity === severity && styles.statusOptionTextActive,
                                    ]}>
                                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <Button variant="secondary" onPress={() => setAddModal(null)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onPress={handleAddAllergy}>
                                Add
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Medication Modal */}
            <Modal
                visible={addModal === 'medication'}
                transparent
                animationType="slide"
                onRequestClose={() => setAddModal(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Medication</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Medication name"
                            placeholderTextColor={VetColors.textMuted}
                            value={newMedication.name}
                            onChangeText={(text) => setNewMedication(prev => ({ ...prev, name: text }))}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Dosage (e.g., 10mg)"
                            placeholderTextColor={VetColors.textMuted}
                            value={newMedication.dosage}
                            onChangeText={(text) => setNewMedication(prev => ({ ...prev, dosage: text }))}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Frequency (e.g., BID)"
                            placeholderTextColor={VetColors.textMuted}
                            value={newMedication.frequency}
                            onChangeText={(text) => setNewMedication(prev => ({ ...prev, frequency: text }))}
                        />

                        <View style={styles.modalButtons}>
                            <Button variant="secondary" onPress={() => setAddModal(null)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onPress={handleAddMedication}>
                                Add
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: VetColors.text,
    },
    addButton: {
        padding: Spacing.xs,
    },
    emptyText: {
        fontSize: 14,
        color: VetColors.textMuted,
        fontStyle: 'italic',
    },
    itemsContainer: {
        gap: Spacing.sm,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: VetColors.backgroundSecondary,
        borderRadius: Radius.md,
        padding: Spacing.md,
    },
    allergyCard: {
        borderLeftWidth: 3,
        borderLeftColor: VetColors.danger,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: VetColors.text,
    },
    itemDetail: {
        fontSize: 13,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        color: VetColors.textSecondary,
        textTransform: 'capitalize',
    },
    removeButton: {
        padding: Spacing.xs,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    modalContent: {
        backgroundColor: VetColors.background,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: VetColors.text,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    input: {
        backgroundColor: VetColors.backgroundSecondary,
        borderRadius: Radius.md,
        padding: Spacing.md,
        fontSize: 16,
        color: VetColors.text,
        marginBottom: Spacing.md,
    },
    notesInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
        marginBottom: Spacing.sm,
    },
    statusPicker: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    statusOption: {
        flex: 1,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        borderWidth: 2,
        borderColor: VetColors.border,
        alignItems: 'center',
    },
    statusOptionActive: {
        borderColor: VetColors.primary,
        backgroundColor: VetColors.primaryLight,
    },
    statusOptionText: {
        fontSize: 14,
        color: VetColors.textSecondary,
    },
    statusOptionTextActive: {
        color: VetColors.primary,
        fontWeight: '600',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
});

export default MedicalHistory;
