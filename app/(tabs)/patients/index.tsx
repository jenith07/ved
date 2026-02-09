import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    Bird,
    Calculator,
    Calendar,
    Cat,
    ChevronDown,
    ChevronRight,
    CircleDot,
    Clock,
    Dog,
    Footprints,
    Phone,
    Plus,
    Rabbit,
    RefreshCw,
    Shell,
    SortAsc,
    Trash2,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, Spacing, Typography, VetColors } from '@/constants/theme';
import { SpeciesBadge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SearchInput } from '@/src/components/ui/Input';
import { SPECIES_CONFIG } from '@/src/types/species';

// Patient interface
interface Patient {
    id: string;
    name: string;
    ownerName: string;
    ownerPhone?: string;
    species: 'canine' | 'feline' | 'equine' | 'bovine' | 'avian' | 'reptile' | 'exotic';
    breed: string;
    weight: number;
    dateOfBirth?: string;
    photo?: string;
    lastVisit: string;
    isSynced: boolean;
}

// Mock patient data with more details
const MOCK_PATIENTS: Patient[] = [
    {
        id: '1',
        name: 'Max',
        ownerName: 'John Smith',
        ownerPhone: '+1 555-0101',
        species: 'canine',
        breed: 'Golden Retriever',
        weight: 32,
        dateOfBirth: '2022-03-15',
        lastVisit: '2026-02-05',
        isSynced: true,
    },
    {
        id: '2',
        name: 'Whiskers',
        ownerName: 'Sarah Johnson',
        ownerPhone: '+1 555-0102',
        species: 'feline',
        breed: 'Persian',
        weight: 4.5,
        dateOfBirth: '2023-06-20',
        lastVisit: '2026-02-07',
        isSynced: true,
    },
    {
        id: '3',
        name: 'Buddy',
        ownerName: 'Mike Davis',
        ownerPhone: '+1 555-0103',
        species: 'canine',
        breed: 'Labrador',
        weight: 28,
        dateOfBirth: '2021-11-08',
        lastVisit: '2026-02-01',
        isSynced: false,
    },
    {
        id: '4',
        name: 'Luna',
        ownerName: 'Emily Brown',
        ownerPhone: '+1 555-0104',
        species: 'feline',
        breed: 'Siamese',
        weight: 3.8,
        dateOfBirth: '2024-01-10',
        lastVisit: '2026-01-20',
        isSynced: true,
    },
    {
        id: '5',
        name: 'Rocky',
        ownerName: 'Chris Wilson',
        ownerPhone: '+1 555-0105',
        species: 'canine',
        breed: 'German Shepherd',
        weight: 35,
        dateOfBirth: '2020-08-22',
        lastVisit: '2025-12-15',
        isSynced: true,
    },
    {
        id: '6',
        name: 'Polly',
        ownerName: 'Lisa Anderson',
        ownerPhone: '+1 555-0106',
        species: 'avian',
        breed: 'African Grey Parrot',
        weight: 0.5,
        dateOfBirth: '2019-04-12',
        lastVisit: '2026-01-28',
        isSynced: false,
    },
];

// Icon components for species
const SpeciesIconComponent = ({ species, size = 24, color = VetColors.textInverse }: { species: string; size?: number; color?: string }) => {
    switch (species) {
        case 'canine': return <Dog size={size} color={color} />;
        case 'feline': return <Cat size={size} color={color} />;
        case 'equine': return <Footprints size={size} color={color} />;
        case 'bovine': return <CircleDot size={size} color={color} />;
        case 'avian': return <Bird size={size} color={color} />;
        case 'reptile': return <Shell size={size} color={color} />;
        case 'exotic': return <Rabbit size={size} color={color} />;
        default: return <Dog size={size} color={color} />;
    }
};

// Calculate age from DOB
const calculateAge = (dob?: string): string => {
    if (!dob) return '';
    const birth = new Date(dob);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    if (years > 0) {
        return months < 0 ? `${years - 1}y ${12 + months}m` : `${years}y ${months}m`;
    } else if (months > 0) {
        return `${months}m`;
    } else {
        const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
        return `${days}d`;
    }
};

// Calculate relative time for last visit
const getLastVisitInfo = (lastVisit: string): { text: string; color: string; status: 'recent' | 'due' | 'overdue' } => {
    const visit = new Date(lastVisit);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - visit.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
        return { text: diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`, color: '#10B981', status: 'recent' };
    } else if (diffDays <= 30) {
        const weeks = Math.floor(diffDays / 7);
        return { text: `${weeks} week${weeks > 1 ? 's' : ''} ago`, color: '#F59E0B', status: 'due' };
    } else if (diffDays <= 90) {
        const months = Math.floor(diffDays / 30);
        return { text: `${months} month${months > 1 ? 's' : ''} ago`, color: '#F59E0B', status: 'due' };
    } else {
        const months = Math.floor(diffDays / 30);
        return { text: `${months} months ago`, color: '#EF4444', status: 'overdue' };
    }
};

// Sort options
type SortOption = 'name' | 'lastVisit' | 'species' | 'weight';

// Quick Action Modal
function QuickActionsModal({
    visible,
    patient,
    onClose,
    onAction,
}: {
    visible: boolean;
    patient: Patient | null;
    onClose: () => void;
    onAction: (action: string) => void;
}) {
    if (!patient) return null;

    const actions = [
        { id: 'call', icon: Phone, label: 'Call Owner', color: '#10B981' },
        { id: 'schedule', icon: Calendar, label: 'Schedule Visit', color: '#3B82F6' },
        { id: 'calculate', icon: Calculator, label: 'Calculate Dosage', color: '#8B5CF6' },
        { id: 'delete', icon: Trash2, label: 'Delete Patient', color: '#EF4444' },
    ];

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{patient.name}</Text>
                    <Text style={styles.modalSubtitle}>{patient.breed} • {patient.ownerName}</Text>

                    <View style={styles.actionsList}>
                        {actions.map((action) => (
                            <Pressable
                                key={action.id}
                                style={styles.actionRow}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    onAction(action.id);
                                    onClose();
                                }}
                            >
                                <View style={[styles.actionIconContainer, { backgroundColor: `${action.color}15` }]}>
                                    <action.icon size={20} color={action.color} />
                                </View>
                                <Text style={[styles.actionLabel, action.id === 'delete' && { color: action.color }]}>
                                    {action.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}

// Stats Header Component
function StatsHeader({ patients }: { patients: Patient[] }) {
    const speciesCount = useMemo(() => {
        const counts: Record<string, number> = {};
        patients.forEach((p) => {
            counts[p.species] = (counts[p.species] || 0) + 1;
        });
        return counts;
    }, [patients]);

    const unsyncedCount = patients.filter(p => !p.isSynced).length;

    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{patients.length}</Text>
                <Text style={styles.statLabel}>Total Patients</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.speciesStats}>
                {Object.entries(speciesCount).slice(0, 3).map(([species, count]) => (
                    <View key={species} style={styles.speciesStat}>
                        <SpeciesIconComponent species={species} size={16} color={SPECIES_CONFIG[species as keyof typeof SPECIES_CONFIG]?.color || '#6B7280'} />
                        <Text style={styles.speciesStatText}>{count}</Text>
                    </View>
                ))}
            </View>
            {unsyncedCount > 0 && (
                <View style={styles.syncBadge}>
                    <RefreshCw size={12} color="#F59E0B" />
                    <Text style={styles.syncBadgeText}>{unsyncedCount}</Text>
                </View>
            )}
        </View>
    );
}

// Skeleton Loading Component
function SkeletonCard() {
    return (
        <View style={styles.skeletonCard}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonInfo}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonSubtitle} />
            </View>
        </View>
    );
}

// Animated Patient Card
function PatientCard({
    patient,
    index,
    onPress,
    onLongPress,
}: {
    patient: Patient;
    index: number;
    onPress: () => void;
    onLongPress: () => void;
}) {
    const speciesConfig = SPECIES_CONFIG[patient.species];
    const lastVisitInfo = getLastVisitInfo(patient.lastVisit);
    const age = calculateAge(patient.dateOfBirth);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 50).springify()}
            layout={Layout.springify()}
            style={animatedStyle}
        >
            <Pressable
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onPress();
                }}
                onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onLongPress();
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                delayLongPress={400}
            >
                <Card variant="elevated" style={styles.patientCard}>
                    <View style={styles.patientContent}>
                        {/* Avatar */}
                        <View style={[styles.patientAvatar, { backgroundColor: speciesConfig.color }]}>
                            {patient.photo ? (
                                <Image source={{ uri: patient.photo }} style={styles.avatarImage} />
                            ) : (
                                <SpeciesIconComponent species={patient.species} size={24} />
                            )}
                            {/* Sync indicator */}
                            {!patient.isSynced && (
                                <View style={styles.syncIndicator}>
                                    <RefreshCw size={10} color="#FFF" />
                                </View>
                            )}
                        </View>

                        {/* Info */}
                        <View style={styles.patientInfo}>
                            <Text style={styles.patientName}>{patient.name}</Text>
                            <Text style={styles.patientDetails}>
                                {patient.breed} • {patient.weight} kg {age && `• ${age}`}
                            </Text>
                            <Text style={styles.ownerName}>Owner: {patient.ownerName}</Text>
                        </View>

                        {/* Meta */}
                        <View style={styles.patientMeta}>
                            <SpeciesBadge species={speciesConfig.name} color={speciesConfig.color} />
                            <View style={[styles.lastVisitBadge, { backgroundColor: `${lastVisitInfo.color}15` }]}>
                                <Clock size={10} color={lastVisitInfo.color} />
                                <Text style={[styles.lastVisitText, { color: lastVisitInfo.color }]}>
                                    {lastVisitInfo.text}
                                </Text>
                            </View>
                            <ChevronRight size={20} color={VetColors.textMuted} style={styles.chevron} />
                        </View>
                    </View>
                </Card>
            </Pressable>
        </Animated.View>
    );
}

// Sort Modal
function SortModal({
    visible,
    currentSort,
    onClose,
    onSelect,
}: {
    visible: boolean;
    currentSort: SortOption;
    onClose: () => void;
    onSelect: (option: SortOption) => void;
}) {
    const options: { id: SortOption; label: string }[] = [
        { id: 'name', label: 'Name (A-Z)' },
        { id: 'lastVisit', label: 'Last Visit' },
        { id: 'species', label: 'Species' },
        { id: 'weight', label: 'Weight' },
    ];

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.sortModalContent}>
                    <Text style={styles.sortModalTitle}>Sort By</Text>
                    {options.map((option) => (
                        <Pressable
                            key={option.id}
                            style={[styles.sortOption, currentSort === option.id && styles.sortOptionActive]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onSelect(option.id);
                                onClose();
                            }}
                        >
                            <Text style={[styles.sortOptionText, currentSort === option.id && styles.sortOptionTextActive]}>
                                {option.label}
                            </Text>
                            {currentSort === option.id && <View style={styles.sortCheck} />}
                        </Pressable>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
}

export default function PatientsScreen() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [showSortModal, setShowSortModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showQuickActions, setShowQuickActions] = useState(false);

    // Load patients (simulating offline-first)
    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        setIsLoading(true);
        // Simulate loading from local storage
        setTimeout(() => {
            setPatients(MOCK_PATIENTS);
            setIsLoading(false);
        }, 800);
    };

    const handleRefresh = useCallback(async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsRefreshing(true);
        // Simulate sync
        setTimeout(() => {
            setPatients(MOCK_PATIENTS.map(p => ({ ...p, isSynced: true })));
            setIsRefreshing(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 1500);
    }, []);

    const handleQuickAction = (action: string) => {
        if (!selectedPatient) return;

        switch (action) {
            case 'call':
                Alert.alert('Call Owner', `Calling ${selectedPatient.ownerPhone}...`);
                break;
            case 'schedule':
                Alert.alert('Schedule Visit', `Schedule appointment for ${selectedPatient.name}`);
                break;
            case 'calculate':
                router.push('/(tabs)/calculator');
                break;
            case 'delete':
                Alert.alert(
                    'Delete Patient',
                    `Are you sure you want to delete ${selectedPatient.name}?`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                                setPatients((prev) => prev.filter((p) => p.id !== selectedPatient.id));
                            },
                        },
                    ]
                );
                break;
        }
    };

    // Filter and sort patients
    const filteredPatients = useMemo(() => {
        let result = patients.filter((patient) => {
            const matchesSearch =
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.breed.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSpecies = !selectedSpeciesFilter || patient.species === selectedSpeciesFilter;
            return matchesSearch && matchesSpecies;
        });

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'lastVisit':
                    return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
                case 'species':
                    return a.species.localeCompare(b.species);
                case 'weight':
                    return b.weight - a.weight;
                default:
                    return 0;
            }
        });

        return result;
    }, [patients, searchQuery, selectedSpeciesFilter, sortBy]);

    const speciesFilters = ['canine', 'feline', 'equine', 'avian', 'exotic'];

    const handleFilterPress = (species: string | null) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedSpeciesFilter(species === selectedSpeciesFilter ? null : species);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Patients</Text>
                <View style={styles.headerActions}>
                    <Pressable
                        style={styles.sortButton}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowSortModal(true);
                        }}
                    >
                        <SortAsc size={20} color={VetColors.primary} />
                        <ChevronDown size={16} color={VetColors.primary} />
                    </Pressable>
                    <Button
                        variant="primary"
                        size="sm"
                        icon={<Plus size={18} color={VetColors.textInverse} />}
                        onPress={() => router.push('/(tabs)/patients/new')}
                    >
                        Add
                    </Button>
                </View>
            </View>

            {/* Stats Header */}
            <StatsHeader patients={patients} />

            {/* Search */}
            <View style={styles.searchContainer}>
                <SearchInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by name, owner, or breed..."
                    onClear={() => setSearchQuery('')}
                />
            </View>

            {/* Species Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
            >
                <Pressable
                    style={[styles.filterChip, !selectedSpeciesFilter && styles.filterChipActive]}
                    onPress={() => handleFilterPress(null)}
                >
                    <Text style={[styles.filterChipText, !selectedSpeciesFilter && styles.filterChipTextActive]}>
                        All
                    </Text>
                </Pressable>
                {speciesFilters.map((species) => {
                    const config = SPECIES_CONFIG[species as keyof typeof SPECIES_CONFIG];
                    const isActive = selectedSpeciesFilter === species;
                    return (
                        <Pressable
                            key={species}
                            style={[
                                styles.filterChip,
                                isActive && styles.filterChipActive,
                                isActive && { backgroundColor: config.color },
                            ]}
                            onPress={() => handleFilterPress(species)}
                        >
                            <SpeciesIconComponent species={species} size={14} color={isActive ? '#FFF' : config.color} />
                            <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                {config.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Patient List */}
            {isLoading ? (
                <View style={styles.skeletonContainer}>
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                </View>
            ) : (
                <FlatList
                    data={filteredPatients}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor={VetColors.primary}
                            colors={[VetColors.primary]}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <PatientCard
                            patient={item}
                            index={index}
                            onPress={() => router.push(`/(tabs)/patients/${item.id}`)}
                            onLongPress={() => {
                                setSelectedPatient(item);
                                setShowQuickActions(true);
                            }}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>No patients found</Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery ? 'Try adjusting your search' : 'Add your first patient to get started'}
                            </Text>
                            {!searchQuery && (
                                <Button
                                    variant="primary"
                                    icon={<Plus size={18} color={VetColors.textInverse} />}
                                    onPress={() => router.push('/(tabs)/patients/new')}
                                    style={styles.emptyButton}
                                >
                                    Add Patient
                                </Button>
                            )}
                        </View>
                    }
                />
            )}

            {/* Modals */}
            <SortModal
                visible={showSortModal}
                currentSort={sortBy}
                onClose={() => setShowSortModal(false)}
                onSelect={setSortBy}
            />

            <QuickActionsModal
                visible={showQuickActions}
                patient={selectedPatient}
                onClose={() => setShowQuickActions(false)}
                onAction={handleQuickAction}
            />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.base,
        paddingTop: Spacing.lg,
    },
    title: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.bold,
        color: VetColors.text,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${VetColors.primary}15`,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.md,
        gap: 2,
    },
    // Stats
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Spacing.base,
        backgroundColor: VetColors.background,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    statCard: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.bold,
        color: VetColors.primary,
    },
    statLabel: {
        fontSize: Typography.sizes.xs,
        color: VetColors.textSecondary,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: VetColors.border,
        marginHorizontal: Spacing.md,
    },
    speciesStats: {
        flex: 1,
        flexDirection: 'row',
        gap: Spacing.md,
    },
    speciesStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    speciesStatText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        color: VetColors.textSecondary,
    },
    syncBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: Radius.full,
        gap: 4,
    },
    syncBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#F59E0B',
    },
    // Search
    searchContainer: {
        paddingHorizontal: Spacing.base,
    },
    // Filters
    filterScroll: {
        maxHeight: 48,
        marginTop: Spacing.sm,
    },
    filterContent: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        backgroundColor: VetColors.backgroundTertiary,
        gap: 6,
    },
    filterChipActive: {
        backgroundColor: VetColors.primary,
    },
    filterChipText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        color: VetColors.textSecondary,
    },
    filterChipTextActive: {
        color: VetColors.textInverse,
    },
    // List
    listContent: {
        padding: Spacing.base,
        paddingBottom: 120,
    },
    // Patient Card
    patientCard: {
        marginBottom: Spacing.md,
    },
    patientContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    patientAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
        overflow: 'hidden',
    },
    avatarImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    syncIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#F59E0B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
    },
    patientDetails: {
        fontSize: Typography.sizes.sm,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    ownerName: {
        fontSize: Typography.sizes.sm,
        color: VetColors.textMuted,
        marginTop: 2,
    },
    patientMeta: {
        alignItems: 'flex-end',
        gap: 4,
    },
    lastVisitBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: Radius.full,
        gap: 4,
    },
    lastVisitText: {
        fontSize: 10,
        fontWeight: '600',
    },
    chevron: {
        marginTop: Spacing.xs,
    },
    // Skeleton
    skeletonContainer: {
        padding: Spacing.base,
    },
    skeletonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: VetColors.background,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    skeletonAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: VetColors.backgroundTertiary,
        marginRight: Spacing.md,
    },
    skeletonInfo: {
        flex: 1,
        gap: 8,
    },
    skeletonTitle: {
        width: '60%',
        height: 16,
        borderRadius: 4,
        backgroundColor: VetColors.backgroundTertiary,
    },
    skeletonSubtitle: {
        width: '80%',
        height: 12,
        borderRadius: 4,
        backgroundColor: VetColors.backgroundTertiary,
    },
    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing['4xl'],
    },
    emptyTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    emptyButton: {
        marginTop: Spacing.md,
    },
    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: VetColors.background,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
    },
    modalTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: VetColors.text,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: Typography.sizes.sm,
        color: VetColors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    actionsList: {
        gap: Spacing.sm,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.md,
        backgroundColor: VetColors.backgroundSecondary,
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    actionLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: VetColors.text,
    },
    // Sort Modal
    sortModalContent: {
        width: '75%',
        backgroundColor: VetColors.background,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
    },
    sortModalTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: VetColors.text,
        marginBottom: Spacing.md,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: VetColors.border,
    },
    sortOptionActive: {
        borderBottomColor: VetColors.primary,
    },
    sortOptionText: {
        fontSize: Typography.sizes.md,
        color: VetColors.textSecondary,
    },
    sortOptionTextActive: {
        color: VetColors.primary,
        fontWeight: Typography.weights.semibold,
    },
    sortCheck: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: VetColors.primary,
    },
});
