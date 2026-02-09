import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Tabs } from 'expo-router';
import { Calculator, Camera, Home, Pill, Plus, Settings, Users, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;

const ICONS: Record<string, typeof Home> = {
  index: Home,
  patients: Users,
  drugs: Pill,
  settings: Settings,
  calculator: Calculator,
};

// Badge counts for demo
const TAB_BADGES: Record<string, number> = {
  patients: 3,
  drugs: 0,
};

// Smooth Animated Tab Icon with Badge
function AnimatedTabIcon({
  name,
  focused,
  isDark,
}: {
  name: string;
  focused: boolean;
  isDark: boolean;
}) {
  const Icon = ICONS[name] || Home;
  const scale = useSharedValue(focused ? 1.15 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.6);
  const bgOpacity = useSharedValue(focused ? 1 : 0);
  const badgeCount = TAB_BADGES[name] || 0;

  useEffect(() => {
    scale.value = withSpring(focused ? 1.15 : 1, { damping: 20, stiffness: 300 });
    opacity.value = withTiming(focused ? 1 : 0.6, { duration: 200 });
    bgOpacity.value = withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(139, 92, 246, ${bgOpacity.value * 0.15})`,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const activeColor = '#8B5CF6';
  const inactiveColor = isDark ? '#9CA3AF' : '#6B7280';

  return (
    <Animated.View style={[styles.iconContainer, containerStyle]}>
      <Animated.View style={iconStyle}>
        <Icon size={22} color={focused ? activeColor : inactiveColor} strokeWidth={focused ? 2.5 : 2} />
      </Animated.View>
      {/* Badge */}
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </Animated.View>
  );
}

// Calculate age from date of birth
function calculateAge(dob: Date): string {
  const today = new Date();
  const years = today.getFullYear() - dob.getFullYear();
  const months = today.getMonth() - dob.getMonth();

  if (years > 0) {
    return months < 0 ? `${years - 1}y ${12 + months}m` : `${years}y ${months}m`;
  } else if (months > 0) {
    return `${months} months`;
  } else {
    const days = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  }
}

// New Patient Bottom Sheet with all improvements
function NewPatientBottomSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const closeSheet = useCallback(() => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    translateY.value = withTiming(SHEET_HEIGHT, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      onClose();
      resetForm();
    }, 300);
  }, [onClose]);

  const resetForm = () => {
    setName('');
    setSpecies('');
    setBreed('');
    setWeight('');
    setOwnerName('');
    setPhoto(null);
    setDateOfBirth(null);
    setErrors({});
  };

  useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      translateY.value = withTiming(0, { duration: 350 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [visible]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SHEET_HEIGHT * 0.3 || event.velocityY > 500) {
        runOnJS(closeSheet)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Pick image from gallery or camera
  const pickImage = async (source: 'camera' | 'gallery') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    let result;
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Camera permission is required');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Gallery permission is required');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Add Photo', 'Choose a source', [
      { text: 'Camera', onPress: () => pickImage('camera') },
      { text: 'Gallery', onPress: () => pickImage('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSpeciesSelect = (s: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSpecies(s);
    if (errors.species) {
      setErrors((prev) => ({ ...prev, species: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Patient name is required';
    if (!species) newErrors.species = 'Please select a species';
    if (!weight.trim()) newErrors.weight = 'Weight is required';
    else if (isNaN(parseFloat(weight))) newErrors.weight = 'Invalid weight';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log({ name, species, breed, weight, ownerName, photo, dateOfBirth });
    Alert.alert('Success', 'Patient saved successfully!');
    closeSheet();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeSheet}>
      <GestureHandlerRootView style={styles.sheetWrapper}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={styles.backdropPressable} onPress={closeSheet} />
        </Animated.View>

        {/* Bottom Sheet */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[
            styles.sheet,
            { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
            sheetStyle
          ]}>
            {/* Drag Handle */}
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: isDark ? '#4B5563' : '#D1D5DB' }]} />
            </View>

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                Add New Patient
              </Text>
              <Pressable onPress={closeSheet} style={styles.closeButton}>
                <X size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </Pressable>
            </View>

            {/* Form */}
            <ScrollView
              style={styles.formScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Photo Upload */}
              <View style={styles.photoSection}>
                <Pressable style={styles.photoContainer} onPress={showImageOptions}>
                  {photo ? (
                    <Image source={{ uri: photo }} style={styles.photoImage} />
                  ) : (
                    <View style={[styles.photoPlaceholder, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                      <Camera size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
                      <Text style={[styles.photoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Add Photo</Text>
                    </View>
                  )}
                </Pressable>
              </View>

              {/* Name */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                  Patient Name *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#374151' : '#F3F4F6',
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      borderColor: errors.name ? '#EF4444' : 'transparent',
                      borderWidth: errors.name ? 1 : 0,
                    }
                  ]}
                  placeholder="Enter patient name"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Species */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                  Species *
                </Text>
                <View style={styles.speciesRow}>
                  {['Canine', 'Feline', 'Equine', 'Exotic'].map((s) => (
                    <Pressable
                      key={s}
                      style={[
                        styles.speciesChip,
                        {
                          backgroundColor: species === s
                            ? '#8B5CF6'
                            : (isDark ? '#374151' : '#F3F4F6'),
                          borderColor: errors.species && !species ? '#EF4444' : 'transparent',
                          borderWidth: errors.species && !species ? 1 : 0,
                        }
                      ]}
                      onPress={() => handleSpeciesSelect(s)}
                    >
                      <Text style={[
                        styles.speciesText,
                        { color: species === s ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#6B7280') }
                      ]}>
                        {s}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
              </View>

              {/* Date of Birth */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                  Date of Birth
                </Text>
                <Pressable
                  style={[
                    styles.input,
                    styles.dateInput,
                    { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowDatePicker(true);
                  }}
                >
                  <Text style={{ color: dateOfBirth ? (isDark ? '#F9FAFB' : '#1F2937') : '#9CA3AF' }}>
                    {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Select date'}
                  </Text>
                  {dateOfBirth && (
                    <View style={styles.ageBadge}>
                      <Text style={styles.ageBadgeText}>{calculateAge(dateOfBirth)}</Text>
                    </View>
                  )}
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Breed */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                  Breed
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#374151' : '#F3F4F6',
                      color: isDark ? '#F9FAFB' : '#1F2937',
                    }
                  ]}
                  placeholder="Enter breed"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                  value={breed}
                  onChangeText={setBreed}
                />
              </View>

              {/* Weight */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                  Weight (kg) *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#374151' : '#F3F4F6',
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      borderColor: errors.weight ? '#EF4444' : 'transparent',
                      borderWidth: errors.weight ? 1 : 0,
                    }
                  ]}
                  placeholder="Enter weight"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                  value={weight}
                  onChangeText={(text) => {
                    setWeight(text);
                    if (errors.weight) setErrors((prev) => ({ ...prev, weight: '' }));
                  }}
                  keyboardType="decimal-pad"
                />
                {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
              </View>

              {/* Owner */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                  Owner Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#374151' : '#F3F4F6',
                      color: isDark ? '#F9FAFB' : '#1F2937',
                    }
                  ]}
                  placeholder="Enter owner name"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                  value={ownerName}
                  onChangeText={setOwnerName}
                />
              </View>

              {/* Save Button */}
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Patient</Text>
              </Pressable>

              <View style={{ height: 50 }} />
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

// Radial FAB Menu
function RadialFABMenu({
  visible,
  onClose,
  onAction,
}: {
  visible: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const item1Y = useSharedValue(0);
  const item2Y = useSharedValue(0);
  const item1Opacity = useSharedValue(0);
  const item2Opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const fabRotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      backdropOpacity.value = withTiming(1, { duration: 200 });
      fabRotation.value = withSpring(45, { damping: 12, stiffness: 200 });
      item1Y.value = withSpring(-80, { damping: 12, stiffness: 200 });
      item1Opacity.value = withDelay(50, withTiming(1, { duration: 200 }));
      item2Y.value = withDelay(50, withSpring(-150, { damping: 12, stiffness: 200 }));
      item2Opacity.value = withDelay(100, withTiming(1, { duration: 200 }));
    } else {
      backdropOpacity.value = withTiming(0, { duration: 150 });
      fabRotation.value = withSpring(0, { damping: 12, stiffness: 200 });
      item1Y.value = withTiming(0, { duration: 150 });
      item1Opacity.value = withTiming(0, { duration: 100 });
      item2Y.value = withTiming(0, { duration: 150 });
      item2Opacity.value = withTiming(0, { duration: 100 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${fabRotation.value}deg` }],
  }));

  const item1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: item1Y.value }],
    opacity: item1Opacity.value,
  }));

  const item2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: item2Y.value }],
    opacity: item2Opacity.value,
  }));

  const handleAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAction(action);
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View style={[styles.radialBackdrop, backdropStyle]} />
      </Pressable>

      {/* Radial Menu Items */}
      <View style={styles.radialContainer}>
        {/* Add Patient */}
        <Animated.View style={[styles.radialItem, item2Style]}>
          <Pressable style={[styles.radialButton, { backgroundColor: '#3B82F6' }]} onPress={() => handleAction('patient')}>
            <Users size={24} color="#FFF" />
          </Pressable>
          <View style={[styles.radialLabel, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.radialLabelText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>Add Patient</Text>
          </View>
        </Animated.View>

        {/* New Calculation */}
        <Animated.View style={[styles.radialItem, item1Style]}>
          <Pressable style={[styles.radialButton, { backgroundColor: '#8B5CF6' }]} onPress={() => handleAction('calculator')}>
            <Calculator size={24} color="#FFF" />
          </Pressable>
          <View style={[styles.radialLabel, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.radialLabelText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>Calculate</Text>
          </View>
        </Animated.View>

        {/* Main FAB (rotates to X) */}
        <Pressable style={styles.radialFab} onPress={onClose}>
          <Animated.View style={fabStyle}>
            <Plus size={30} color="#FFFFFF" strokeWidth={2.5} />
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
}

// Custom Floating Tab Bar
function CustomTabBar({ state, descriptors, navigation }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [showPatientSheet, setShowPatientSheet] = useState(false);

  const visibleRoutes = state.routes.filter((route: any) => {
    const { options } = descriptors[route.key];
    return options.href !== null && route.name !== 'explore';
  });

  const leftRoutes = visibleRoutes.filter((r: any) => r.name === 'index' || r.name === 'patients');
  const rightRoutes = visibleRoutes.filter((r: any) => r.name === 'drugs' || r.name === 'settings');

  const handleAction = (action: string) => {
    if (action === 'calculator') {
      navigation.navigate('calculator');
    } else if (action === 'patient') {
      setShowPatientSheet(true);
    }
  };

  const handleTabPress = (route: any, isFocused: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const renderTab = (route: any) => {
    const isFocused = state.routes[state.index].key === route.key;

    return (
      <Pressable key={route.key} onPress={() => handleTabPress(route, isFocused)} style={styles.tabItem}>
        <AnimatedTabIcon
          name={route.name}
          focused={isFocused}
          isDark={isDark}
        />
      </Pressable>
    );
  };

  return (
    <>
      {/* Floating Tab Bar */}
      <View style={[
        styles.floatingTabBar,
        { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)' }
      ]}>
        <View style={styles.tabGroup}>
          {leftRoutes.map(renderTab)}
        </View>
        <View style={styles.fabSpacer} />
        <View style={styles.tabGroup}>
          {rightRoutes.map(renderTab)}
        </View>
      </View>

      {/* Elevated Center FAB */}
      <Pressable
        style={styles.fabButton}
        onPress={() => setShowRadialMenu(true)}
      >
        <Plus size={30} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>

      {/* Radial FAB Menu */}
      <RadialFABMenu
        visible={showRadialMenu}
        onClose={() => setShowRadialMenu(false)}
        onAction={handleAction}
      />

      {/* New Patient Bottom Sheet */}
      <NewPatientBottomSheet
        visible={showPatientSheet}
        onClose={() => setShowPatientSheet(false)}
      />
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="calculator" options={{ title: 'Calc', href: null }} />
      <Tabs.Screen name="patients" options={{ title: 'Pets' }} />
      <Tabs.Screen name="drugs" options={{ title: 'Drugs' }} />
      <Tabs.Screen name="settings" options={{ title: 'More' }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    left: 20,
    right: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  tabGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fabSpacer: {
    width: 80,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  fabButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 42,
    left: '50%',
    marginLeft: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  // Radial Menu
  radialBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  radialContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 42,
    left: '50%',
    marginLeft: -32,
    alignItems: 'center',
  },
  radialItem: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  radialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  radialLabel: {
    position: 'absolute',
    left: 60,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  radialLabelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  radialFab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  // Bottom Sheet Styles
  sheetWrapper: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 12,
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  speciesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speciesChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  speciesText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    height: 52,
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
