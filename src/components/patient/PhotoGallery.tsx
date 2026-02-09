/**
 * Patient Photo Gallery Component
 * Displays and manages patient photos
 */
import { Radius, Spacing, VetColors } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm * 2) / 3;

interface Photo {
    id: string;
    uri: string;
    caption?: string;
    takenAt: number;
}

interface PhotoGalleryProps {
    photos: Photo[];
    onAddPhoto: (uri: string, caption?: string) => Promise<void>;
    onDeletePhoto: (photoId: string) => Promise<void>;
    editable?: boolean;
}

export function PhotoGallery({
    photos,
    onAddPhoto,
    onDeletePhoto,
    editable = true,
}: PhotoGalleryProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
            Alert.alert(
                'Permissions Required',
                'Please grant camera and photo library permissions to add photos.'
            );
            return false;
        }
        return true;
    };

    const takePhoto = async () => {
        setShowOptions(false);
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.canceled && result.assets[0]) {
            await onAddPhoto(result.assets[0].uri);
        }
    };

    const pickFromLibrary = async () => {
        setShowOptions(false);
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.canceled && result.assets[0]) {
            await onAddPhoto(result.assets[0].uri);
        }
    };

    const handleDelete = useCallback((photo: Photo) => {
        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        onDeletePhoto(photo.id);
                        setSelectedPhoto(null);
                    },
                },
            ]
        );
    }, [onDeletePhoto]);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const renderPhoto = ({ item }: { item: Photo }) => (
        <Pressable
            style={styles.photoContainer}
            onPress={() => setSelectedPhoto(item)}
        >
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        </Pressable>
    );

    const renderAddButton = () => {
        if (!editable) return null;

        return (
            <Pressable style={styles.addButton} onPress={() => setShowOptions(true)}>
                <Plus size={24} color={VetColors.primary} />
            </Pressable>
        );
    };

    const EmptyGallery = () => (
        <View style={styles.emptyContainer}>
            <ImageIcon size={48} color={VetColors.textMuted} />
            <Text style={styles.emptyText}>No photos yet</Text>
            {editable && (
                <Pressable style={styles.addFirstButton} onPress={() => setShowOptions(true)}>
                    <Camera size={20} color={VetColors.textInverse} />
                    <Text style={styles.addFirstButtonText}>Add Photo</Text>
                </Pressable>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {photos.length === 0 ? (
                <EmptyGallery />
            ) : (
                <FlatList
                    data={photos}
                    renderItem={renderPhoto}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    columnWrapperStyle={styles.row}
                    ListFooterComponent={renderAddButton}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Add Photo Options Modal */}
            <Modal
                visible={showOptions}
                transparent
                animationType="fade"
                onRequestClose={() => setShowOptions(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowOptions(false)}>
                    <View style={styles.optionsSheet}>
                        <Text style={styles.optionsTitle}>Add Photo</Text>

                        <Pressable style={styles.optionButton} onPress={takePhoto}>
                            <Camera size={24} color={VetColors.primary} />
                            <Text style={styles.optionText}>Take Photo</Text>
                        </Pressable>

                        <Pressable style={styles.optionButton} onPress={pickFromLibrary}>
                            <ImageIcon size={24} color={VetColors.primary} />
                            <Text style={styles.optionText}>Choose from Library</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.optionButton, styles.cancelButton]}
                            onPress={() => setShowOptions(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            {/* Full Image Modal */}
            <Modal
                visible={!!selectedPhoto}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedPhoto(null)}
            >
                <View style={styles.fullImageContainer}>
                    <View style={styles.fullImageHeader}>
                        {selectedPhoto && (
                            <Text style={styles.photoDate}>
                                {formatDate(selectedPhoto.takenAt)}
                            </Text>
                        )}
                        <View style={styles.headerActions}>
                            {editable && selectedPhoto && (
                                <Pressable
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(selectedPhoto)}
                                >
                                    <Trash2 size={22} color={VetColors.danger} />
                                </Pressable>
                            )}
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setSelectedPhoto(null)}
                            >
                                <X size={24} color={VetColors.textInverse} />
                            </Pressable>
                        </View>
                    </View>

                    {selectedPhoto && (
                        <Image
                            source={{ uri: selectedPhoto.uri }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    )}

                    {selectedPhoto?.caption && (
                        <View style={styles.captionContainer}>
                            <Text style={styles.caption}>{selectedPhoto.caption}</Text>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    photoContainer: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: Radius.md,
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: VetColors.backgroundSecondary,
    },
    addButton: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: Radius.md,
        borderWidth: 2,
        borderColor: VetColors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: VetColors.backgroundSecondary,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: Spacing['2xl'],
    },
    emptyText: {
        fontSize: 16,
        color: VetColors.textMuted,
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
    addFirstButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: VetColors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: Radius.lg,
    },
    addFirstButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: VetColors.textInverse,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    optionsSheet: {
        backgroundColor: VetColors.background,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        padding: Spacing.lg,
        paddingBottom: Spacing['2xl'],
    },
    optionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: VetColors.text,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        padding: Spacing.md,
        borderRadius: Radius.md,
        backgroundColor: VetColors.backgroundSecondary,
        marginBottom: Spacing.sm,
    },
    optionText: {
        fontSize: 16,
        color: VetColors.text,
    },
    cancelButton: {
        justifyContent: 'center',
        marginTop: Spacing.sm,
    },
    cancelText: {
        fontSize: 16,
        color: VetColors.textMuted,
        textAlign: 'center',
    },
    fullImageContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    fullImageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: 60,
        paddingBottom: Spacing.md,
    },
    photoDate: {
        fontSize: 14,
        color: VetColors.textInverse,
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    deleteButton: {
        padding: Spacing.sm,
    },
    closeButton: {
        padding: Spacing.sm,
    },
    fullImage: {
        flex: 1,
        width: '100%',
    },
    captionContainer: {
        padding: Spacing.lg,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    caption: {
        fontSize: 14,
        color: VetColors.textInverse,
        textAlign: 'center',
    },
});

export default PhotoGallery;
