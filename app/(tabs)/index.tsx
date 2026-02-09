import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  Calculator,
  ChevronRight,
  Users
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing, Typography, VetColors } from '@/constants/theme';
import { Badge, StatusBadge } from '@/src/components/ui/Badge';
import { ActionCard, Card } from '@/src/components/ui/Card';
import { useAppStore } from '@/src/store/useAppStore';

export default function HomeScreen() {
  const router = useRouter();
  const { isOnline, pendingSyncCount, recentPatientIds } = useAppStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning! 👋</Text>
            <Text style={styles.title}>VetDose Pro</Text>
          </View>
          <View style={styles.headerRight}>
            <StatusBadge status={isOnline ? 'online' : 'offline'} />
            {pendingSyncCount > 0 && (
              <Badge variant="warning" size="sm" style={styles.syncBadge}>
                {pendingSyncCount} pending
              </Badge>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionCard
            icon={<Calculator size={32} color={VetColors.textInverse} />}
            title="New Calculation"
            subtitle="Drug dosing"
            gradientColors={[VetColors.gradientPurpleStart, VetColors.gradientPurpleEnd]}
            onPress={() => router.push('/(tabs)/calculator')}
          />
          <ActionCard
            icon={<Users size={32} color={VetColors.textInverse} />}
            title="Add Patient"
            subtitle="New record"
            gradientColors={[VetColors.gradientBlueStart, VetColors.gradientBlueEnd]}
            onPress={() => router.push('/(tabs)/patients')}
          />
        </View>

        {/* Emergency Access */}
        <Card
          variant="elevated"
          backgroundColor={VetColors.cardRed}
          pressable
          onPress={() => router.push('/emergency/toxicity')}
          style={styles.emergencyCard}
        >
          <View style={styles.emergencyContent}>
            <View style={styles.emergencyIcon}>
              <AlertTriangle size={28} color={VetColors.emergency} />
            </View>
            <View style={styles.emergencyText}>
              <Text style={styles.emergencyTitle}>Emergency Protocols</Text>
              <Text style={styles.emergencySubtitle}>
                Toxicity calculator & antidote reference
              </Text>
            </View>
            <ChevronRight size={24} color={VetColors.emergency} />
          </View>
        </Card>

        {/* Recent Patients */}
        {recentPatientIds.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Patients</Text>
            <Card variant="default" style={styles.recentCard}>
              <Text style={styles.emptyText}>
                Recent patients will appear here
              </Text>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
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
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: Typography.sizes.base,
    color: VetColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: VetColors.text,
  },
  syncBadge: {
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: VetColors.text,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  emergencyCard: {
    marginBottom: Spacing.lg,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: VetColors.emergency,
  },
  emergencySubtitle: {
    fontSize: Typography.sizes.sm,
    color: VetColors.textSecondary,
    marginTop: 2,
  },
  recentCard: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: VetColors.textMuted,
  },
});
