import { ChevronRight, Clock, Filter, Heart, Pill, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, Spacing, Typography, VetColors } from '@/constants/theme';
import { Badge } from '@/src/components/ui/Badge';
import { IconButton } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SearchInput } from '@/src/components/ui/Input';
import { useAppStore } from '@/src/store/useAppStore';

// Mock drug data
const MOCK_DRUGS = [
    {
        id: '1',
        genericName: 'Amoxicillin',
        brandNames: ['Amoxi-Tabs', 'Biomox'],
        category: 'Antibiotic',
        isHighRisk: false,
    },
    {
        id: '2',
        genericName: 'Carprofen',
        brandNames: ['Rimadyl', 'Novox'],
        category: 'NSAID',
        isHighRisk: true,
    },
    {
        id: '3',
        genericName: 'Metronidazole',
        brandNames: ['Flagyl'],
        category: 'Antibiotic',
        isHighRisk: false,
    },
    {
        id: '4',
        genericName: 'Doxycycline',
        brandNames: ['Vibramycin'],
        category: 'Antibiotic',
        isHighRisk: false,
    },
    {
        id: '5',
        genericName: 'Prednisone',
        brandNames: ['Deltasone'],
        category: 'Corticosteroid',
        isHighRisk: true,
    },
    {
        id: '6',
        genericName: 'Gabapentin',
        brandNames: ['Neurontin'],
        category: 'Analgesic',
        isHighRisk: false,
    },
];

const CATEGORIES = ['All', 'Antibiotic', 'NSAID', 'Analgesic', 'Corticosteroid', 'Sedative'];

export default function DrugsScreen() {
    const { favoriteDrugIds, toggleFavoriteDrug, recentDrugIds } = useAppStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const filteredDrugs = MOCK_DRUGS.filter((drug) => {
        const matchesSearch =
            drug.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            drug.brandNames.some((name) =>
                name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        const matchesCategory =
            selectedCategory === 'All' || drug.category === selectedCategory;
        const matchesFavorites = !showFavoritesOnly || favoriteDrugIds.includes(drug.id);
        return matchesSearch && matchesCategory && matchesFavorites;
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Drug Database</Text>
                <View style={styles.headerActions}>
                    <IconButton
                        icon={
                            <Star
                                size={20}
                                color={showFavoritesOnly ? VetColors.warning : VetColors.textSecondary}
                                fill={showFavoritesOnly ? VetColors.warning : 'transparent'}
                            />
                        }
                        onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    />
                    <IconButton
                        icon={<Filter size={20} color={VetColors.textSecondary} />}
                    />
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <SearchInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by generic or brand name..."
                    onClear={() => setSearchQuery('')}
                />
            </View>

            {/* Category Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
            >
                {CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                        <Pressable
                            key={category}
                            style={[styles.filterChip, isActive && styles.filterChipActive]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    isActive && styles.filterChipTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Recent Searches */}
            {recentDrugIds.length > 0 && !searchQuery && (
                <View style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Clock size={16} color={VetColors.textSecondary} />
                        <Text style={styles.sectionTitle}>Recent</Text>
                    </View>
                </View>
            )}

            {/* Drug List */}
            <FlatList
                data={filteredDrugs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isFavorite = favoriteDrugIds.includes(item.id);
                    return (
                        <Card variant="elevated" pressable style={styles.drugCard}>
                            <View style={styles.drugContent}>
                                <View style={styles.drugIcon}>
                                    <Pill size={24} color={VetColors.primary} />
                                </View>
                                <View style={styles.drugInfo}>
                                    <View style={styles.drugNameRow}>
                                        <Text style={styles.drugName}>{item.genericName}</Text>
                                        {item.isHighRisk && (
                                            <Badge variant="danger" size="sm">
                                                High Risk
                                            </Badge>
                                        )}
                                    </View>
                                    <Text style={styles.brandNames}>
                                        {item.brandNames.join(', ')}
                                    </Text>
                                    <Badge variant="default" size="sm" style={styles.categoryBadge}>
                                        {item.category}
                                    </Badge>
                                </View>
                                <View style={styles.drugActions}>
                                    <Pressable
                                        onPress={() => toggleFavoriteDrug(item.id)}
                                        hitSlop={8}
                                    >
                                        <Heart
                                            size={20}
                                            color={isFavorite ? VetColors.danger : VetColors.textMuted}
                                            fill={isFavorite ? VetColors.danger : 'transparent'}
                                        />
                                    </Pressable>
                                    <ChevronRight
                                        size={20}
                                        color={VetColors.textMuted}
                                        style={styles.chevron}
                                    />
                                </View>
                            </View>
                        </Card>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Pill size={48} color={VetColors.textMuted} />
                        <Text style={styles.emptyTitle}>No drugs found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try adjusting your search or filters
                        </Text>
                    </View>
                }
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
        gap: Spacing.sm,
    },
    searchContainer: {
        paddingHorizontal: Spacing.base,
    },
    filterScroll: {
        maxHeight: 48,
        marginTop: Spacing.sm,
    },
    filterContent: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
    },
    filterChip: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        backgroundColor: VetColors.backgroundTertiary,
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
    recentSection: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.medium,
        color: VetColors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    listContent: {
        padding: Spacing.base,
        paddingBottom: 120, // Extra space for floating tab bar
    },
    drugCard: {
        marginBottom: Spacing.md,
    },
    drugContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    drugIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: VetColors.cardPurple,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    drugInfo: {
        flex: 1,
    },
    drugNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    drugName: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
    },
    brandNames: {
        fontSize: Typography.sizes.sm,
        color: VetColors.textSecondary,
        marginTop: 2,
    },
    categoryBadge: {
        marginTop: Spacing.xs,
        alignSelf: 'flex-start',
    },
    drugActions: {
        alignItems: 'center',
    },
    chevron: {
        marginTop: Spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing['4xl'],
    },
    emptyTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.semibold,
        color: VetColors.text,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        fontSize: Typography.sizes.base,
        color: VetColors.textSecondary,
        textAlign: 'center',
    },
});
