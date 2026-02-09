/**
 * QR Code Generator Component
 * Generates QR codes for patient cage cards
 */
import { Radius, Spacing, VetColors } from '@/constants/theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Download, QrCode, Share2 } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';

// Document directory for saving files
// @ts-ignore - expo-file-system type issue
const docDir = FileSystem.documentDirectory || '';

interface PatientQRData {
    id: string;
    name: string;
    species: string;
    breed?: string;
    ownerName: string;
    ownerPhone?: string;
    weight?: number;
    weightUnit?: string;
    allergies?: string[];
}

interface QRCodeGeneratorProps {
    patient: PatientQRData;
    size?: number;
}

export function QRCodeGenerator({ patient, size = 200 }: QRCodeGeneratorProps) {
    const qrRef = useRef<View>(null);

    // Create compact data for QR code
    const qrData = JSON.stringify({
        v: 1, // version
        id: patient.id,
        n: patient.name,
        s: patient.species,
        b: patient.breed || '',
        o: patient.ownerName,
        p: patient.ownerPhone || '',
        w: patient.weight ? `${patient.weight}${patient.weightUnit || 'kg'}` : '',
        a: patient.allergies?.join(',') || '',
    });

    const handleShare = async () => {
        try {
            if (!qrRef.current) return;

            const uri = await captureRef(qrRef.current, {
                format: 'png',
                quality: 1,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: `${patient.name} - Cage Card QR`,
                });
            } else {
                Alert.alert('Sharing not available', 'Sharing is not available on this device');
            }
        } catch (error) {
            console.error('Error sharing QR code:', error);
            Alert.alert('Error', 'Failed to share QR code');
        }
    };

    const handleSave = async () => {
        try {
            if (!qrRef.current) return;

            const uri = await captureRef(qrRef.current, {
                format: 'png',
                quality: 1,
            });

            if (Platform.OS === 'ios') {
                // On iOS, use share to save to photos
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                });
            } else {
                // On Android, save to Downloads
                const fileName = `${patient.name.replace(/\s+/g, '_')}_cage_card.png`;
                // @ts-ignore - expo-file-system type issue
                const destPath = `${docDir}${fileName}`;
                await FileSystem.copyAsync({ from: uri, to: destPath });
                Alert.alert('Saved', `QR code saved to ${fileName}`);
            }
        } catch (error) {
            console.error('Error saving QR code:', error);
            Alert.alert('Error', 'Failed to save QR code');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <QrCode size={20} color={VetColors.primary} />
                <Text style={styles.title}>Cage Card QR Code</Text>
            </View>

            <View ref={qrRef} style={styles.qrContainer} collapsable={false}>
                <View style={styles.cageCard}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientInfo}>
                        {patient.species}{patient.breed ? ` • ${patient.breed}` : ''}
                    </Text>

                    <View style={styles.qrWrapper}>
                        <QRCode
                            value={qrData}
                            size={size}
                            backgroundColor="white"
                            color={VetColors.text}
                            logo={undefined}
                        />
                    </View>

                    <Text style={styles.ownerInfo}>Owner: {patient.ownerName}</Text>
                    {patient.ownerPhone && (
                        <Text style={styles.phoneInfo}>{patient.ownerPhone}</Text>
                    )}

                    {patient.allergies && patient.allergies.length > 0 && (
                        <View style={styles.allergyWarning}>
                            <Text style={styles.allergyText}>
                                ⚠️ ALLERGIES: {patient.allergies.join(', ')}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.actions}>
                <Pressable style={styles.actionButton} onPress={handleShare}>
                    <Share2 size={20} color={VetColors.primary} />
                    <Text style={styles.actionText}>Share</Text>
                </Pressable>

                <Pressable style={styles.actionButton} onPress={handleSave}>
                    <Download size={20} color={VetColors.primary} />
                    <Text style={styles.actionText}>Save</Text>
                </Pressable>
            </View>

            <Text style={styles.hint}>
                Scan this QR code to quickly load patient information
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: VetColors.text,
    },
    qrContainer: {
        backgroundColor: 'white',
        borderRadius: Radius.lg,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cageCard: {
        padding: Spacing.lg,
        alignItems: 'center',
        minWidth: 280,
    },
    patientName: {
        fontSize: 24,
        fontWeight: '700',
        color: VetColors.text,
        marginBottom: Spacing.xs,
    },
    patientInfo: {
        fontSize: 14,
        color: VetColors.textSecondary,
        marginBottom: Spacing.md,
    },
    qrWrapper: {
        padding: Spacing.md,
        backgroundColor: 'white',
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
    },
    ownerInfo: {
        fontSize: 14,
        fontWeight: '500',
        color: VetColors.text,
    },
    phoneInfo: {
        fontSize: 13,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    allergyWarning: {
        marginTop: Spacing.md,
        backgroundColor: VetColors.cardRed,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.sm,
    },
    allergyText: {
        fontSize: 12,
        fontWeight: '600',
        color: VetColors.danger,
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.lg,
        marginTop: Spacing.lg,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        backgroundColor: VetColors.backgroundSecondary,
        borderRadius: Radius.md,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        color: VetColors.primary,
    },
    hint: {
        fontSize: 12,
        color: VetColors.textMuted,
        marginTop: Spacing.md,
        textAlign: 'center',
    },
});

export default QRCodeGenerator;
