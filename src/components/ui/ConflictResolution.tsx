/**
 * Conflict Resolution Component
 * UI for resolving sync conflicts between local and remote data
 */
import { Radius, Spacing, VetColors } from '@/constants/theme';
import {
    AlertTriangle,
    Check,
    Cloud,
    RefreshCw,
    Smartphone,
    X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Button } from './Button';

interface ConflictData {
    id: string;
    tableName: string;
    fieldName: string;
    localValue: any;
    remoteValue: any;
    localUpdatedAt: number;
    remoteUpdatedAt: number;
}

interface ConflictResolutionProps {
    conflicts: ConflictData[];
    onResolve: (conflictId: string, resolution: 'local' | 'remote') => void;
    onResolveAll: (resolution: 'local' | 'remote') => void;
    onDismiss: () => void;
    visible: boolean;
}

export function ConflictResolution({
    conflicts,
    onResolve,
    onResolveAll,
    onDismiss,
    visible,
}: ConflictResolutionProps) {
    const [selectedConflict, setSelectedConflict] = useState<ConflictData | null>(null);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatValue = (value: any): string => {
        if (value === null || value === undefined) return 'Empty';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    const getTableDisplayName = (tableName: string): string => {
        const names: Record<string, string> = {
            patients: 'Patient',
            calculations: 'Calculation',
            weight_records: 'Weight Record',
            patient_photos: 'Photo',
        };
        return names[tableName] || tableName;
    };

    if (conflicts.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <AlertTriangle size={24} color={VetColors.warning} />
                            <Text style={styles.title}>Sync Conflicts</Text>
                        </View>
                        <Text style={styles.subtitle}>
                            {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} found
                        </Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <Pressable
                            style={[styles.quickAction, styles.localAction]}
                            onPress={() => onResolveAll('local')}
                        >
                            <Smartphone size={16} color={VetColors.primary} />
                            <Text style={styles.quickActionText}>Keep All Local</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.quickAction, styles.remoteAction]}
                            onPress={() => onResolveAll('remote')}
                        >
                            <Cloud size={16} color={VetColors.secondary} />
                            <Text style={styles.quickActionText}>Keep All Remote</Text>
                        </Pressable>
                    </View>

                    {/* Conflict List */}
                    <ScrollView style={styles.conflictList}>
                        {conflicts.map((conflict) => (
                            <Pressable
                                key={conflict.id}
                                style={styles.conflictCard}
                                onPress={() => setSelectedConflict(conflict)}
                            >
                                <View style={styles.conflictHeader}>
                                    <Text style={styles.conflictTable}>
                                        {getTableDisplayName(conflict.tableName)}
                                    </Text>
                                    <RefreshCw size={16} color={VetColors.warning} />
                                </View>
                                <Text style={styles.conflictField}>
                                    Field: <Text style={styles.fieldName}>{conflict.fieldName}</Text>
                                </Text>
                                <View style={styles.conflictValues}>
                                    <View style={styles.valueBox}>
                                        <Smartphone size={12} color={VetColors.primary} />
                                        <Text style={styles.valueLabel}>Local</Text>
                                        <Text style={styles.valueText} numberOfLines={1}>
                                            {formatValue(conflict.localValue)}
                                        </Text>
                                    </View>
                                    <View style={styles.valueBox}>
                                        <Cloud size={12} color={VetColors.secondary} />
                                        <Text style={styles.valueLabel}>Remote</Text>
                                        <Text style={styles.valueText} numberOfLines={1}>
                                            {formatValue(conflict.remoteValue)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.conflictActions}>
                                    <Pressable
                                        style={[styles.resolveButton, styles.resolveLocal]}
                                        onPress={() => onResolve(conflict.id, 'local')}
                                    >
                                        <Check size={14} color={VetColors.primary} />
                                        <Text style={styles.resolveLocalText}>Local</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.resolveButton, styles.resolveRemote]}
                                        onPress={() => onResolve(conflict.id, 'remote')}
                                    >
                                        <Check size={14} color={VetColors.secondary} />
                                        <Text style={styles.resolveRemoteText}>Remote</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Button variant="secondary" onPress={onDismiss}>
                            Dismiss
                        </Button>
                    </View>
                </View>
            </View>

            {/* Detail Modal */}
            <Modal
                visible={!!selectedConflict}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedConflict(null)}
            >
                <Pressable
                    style={styles.detailOverlay}
                    onPress={() => setSelectedConflict(null)}
                >
                    <View style={styles.detailContainer}>
                        <View style={styles.detailHeader}>
                            <Text style={styles.detailTitle}>
                                {selectedConflict && getTableDisplayName(selectedConflict.tableName)}
                            </Text>
                            <Pressable onPress={() => setSelectedConflict(null)}>
                                <X size={24} color={VetColors.text} />
                            </Pressable>
                        </View>

                        {selectedConflict && (
                            <>
                                <Text style={styles.detailField}>
                                    {selectedConflict.fieldName}
                                </Text>

                                <View style={styles.detailSection}>
                                    <View style={styles.detailLabel}>
                                        <Smartphone size={16} color={VetColors.primary} />
                                        <Text style={styles.detailLabelText}>Local Version</Text>
                                    </View>
                                    <Text style={styles.detailTimestamp}>
                                        Modified: {formatDate(selectedConflict.localUpdatedAt)}
                                    </Text>
                                    <View style={styles.detailValue}>
                                        <Text style={styles.detailValueText}>
                                            {formatValue(selectedConflict.localValue)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.detailSection}>
                                    <View style={styles.detailLabel}>
                                        <Cloud size={16} color={VetColors.secondary} />
                                        <Text style={styles.detailLabelText}>Remote Version</Text>
                                    </View>
                                    <Text style={styles.detailTimestamp}>
                                        Modified: {formatDate(selectedConflict.remoteUpdatedAt)}
                                    </Text>
                                    <View style={styles.detailValue}>
                                        <Text style={styles.detailValueText}>
                                            {formatValue(selectedConflict.remoteValue)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.detailActions}>
                                    <Button
                                        variant="secondary"
                                        onPress={() => {
                                            onResolve(selectedConflict.id, 'local');
                                            setSelectedConflict(null);
                                        }}
                                    >
                                        Keep Local
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onPress={() => {
                                            onResolve(selectedConflict.id, 'remote');
                                            setSelectedConflict(null);
                                        }}
                                    >
                                        Keep Remote
                                    </Button>
                                </View>
                            </>
                        )}
                    </View>
                </Pressable>
            </Modal>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: VetColors.background,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        maxHeight: '80%',
    },
    header: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: VetColors.border,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: VetColors.text,
    },
    subtitle: {
        fontSize: 14,
        color: VetColors.textSecondary,
        marginTop: Spacing.xs,
    },
    quickActions: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    quickAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        borderWidth: 1,
    },
    localAction: {
        borderColor: VetColors.primary,
        backgroundColor: VetColors.primaryLight,
    },
    remoteAction: {
        borderColor: VetColors.secondary,
        backgroundColor: VetColors.secondaryLight,
    },
    quickActionText: {
        fontSize: 13,
        fontWeight: '500',
        color: VetColors.text,
    },
    conflictList: {
        flex: 1,
        padding: Spacing.md,
    },
    conflictCard: {
        backgroundColor: VetColors.backgroundSecondary,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderLeftWidth: 3,
        borderLeftColor: VetColors.warning,
    },
    conflictHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    conflictTable: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
    },
    conflictField: {
        fontSize: 13,
        color: VetColors.textSecondary,
        marginBottom: Spacing.sm,
    },
    fieldName: {
        fontWeight: '500',
        color: VetColors.text,
    },
    conflictValues: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    valueBox: {
        flex: 1,
        backgroundColor: VetColors.background,
        borderRadius: Radius.sm,
        padding: Spacing.sm,
    },
    valueLabel: {
        fontSize: 11,
        color: VetColors.textMuted,
        marginTop: 2,
    },
    valueText: {
        fontSize: 13,
        color: VetColors.text,
        marginTop: 2,
    },
    conflictActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    resolveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
    },
    resolveLocal: {
        backgroundColor: VetColors.primaryLight,
    },
    resolveRemote: {
        backgroundColor: VetColors.secondaryLight,
    },
    resolveLocalText: {
        fontSize: 13,
        fontWeight: '500',
        color: VetColors.primary,
    },
    resolveRemoteText: {
        fontSize: 13,
        fontWeight: '500',
        color: VetColors.secondary,
    },
    footer: {
        padding: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: VetColors.border,
    },
    detailOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    detailContainer: {
        backgroundColor: VetColors.background,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: VetColors.text,
    },
    detailField: {
        fontSize: 16,
        fontWeight: '500',
        color: VetColors.primary,
        marginBottom: Spacing.lg,
    },
    detailSection: {
        marginBottom: Spacing.lg,
    },
    detailLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    detailLabelText: {
        fontSize: 14,
        fontWeight: '600',
        color: VetColors.text,
    },
    detailTimestamp: {
        fontSize: 12,
        color: VetColors.textMuted,
        marginBottom: Spacing.sm,
    },
    detailValue: {
        backgroundColor: VetColors.backgroundSecondary,
        borderRadius: Radius.md,
        padding: Spacing.md,
    },
    detailValueText: {
        fontSize: 14,
        color: VetColors.text,
        fontFamily: 'monospace',
    },
    detailActions: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
});

export default ConflictResolution;
