import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography, VetColors } from '@/constants/theme';
import { Button, IconButton } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

export default function NewPatientScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon={<X size={24} color={VetColors.text} />}
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>New Patient</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <Input
                    label="Patient Name"
                    placeholder="Enter patient name"
                />
                <Input
                    label="Owner Name"
                    placeholder="Enter owner's name"
                />
                <Input
                    label="Breed"
                    placeholder="Enter breed"
                />
                <Input
                    label="Weight (kg)"
                    placeholder="Enter weight"
                    keyboardType="decimal-pad"
                />

                <View style={styles.actions}>
                    <Button variant="outline" onPress={() => router.back()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onPress={() => router.back()}>
                        Save Patient
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: VetColors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: VetColors.border,
    },
    title: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.base,
        paddingBottom: Spacing['3xl'],
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.xl,
    },
});
