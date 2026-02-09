import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Camera, Edit, History, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing, Typography, VetColors } from '@/constants/theme';
import { Button, IconButton } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export default function PatientDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <IconButton
                    icon={<ArrowLeft size={24} color={VetColors.text} />}
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>Patient Details</Text>
                <View style={styles.headerActions}>
                    <IconButton icon={<Edit size={20} color={VetColors.primary} />} />
                    <IconButton icon={<Trash2 size={20} color={VetColors.danger} />} />
                </View>
            </View>

            <View style={styles.content}>
                <Card variant="elevated" style={styles.patientCard}>
                    <Text style={styles.patientName}>Patient #{id}</Text>
                    <Text style={styles.placeholder}>
                        Patient details will be loaded from the database
                    </Text>
                </Card>

                <View style={styles.actions}>
                    <Button
                        variant="primary"
                        icon={<History size={18} color={VetColors.textInverse} />}
                        fullWidth
                    >
                        View Calculation History
                    </Button>
                    <Button
                        variant="outline"
                        icon={<Camera size={18} color={VetColors.primary} />}
                        fullWidth
                    >
                        Add Photo
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: VetColors.backgroundSecondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: VetColors.background,
        borderBottomWidth: 1,
        borderBottomColor: VetColors.border,
    },
    title: {
        flex: 1,
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
        marginLeft: Spacing.md,
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    content: {
        flex: 1,
        padding: Spacing.base,
    },
    patientCard: {
        marginBottom: Spacing.lg,
    },
    patientName: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: VetColors.text,
        marginBottom: Spacing.sm,
    },
    placeholder: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
    },
    actions: {
        gap: Spacing.md,
    },
});
