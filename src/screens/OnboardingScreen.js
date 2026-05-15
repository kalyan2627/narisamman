import React, { useState, useRef } from 'react';
import {
  View, StyleSheet, Dimensions, TouchableOpacity,
  ScrollView } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../theme/colors';import Text from "../autoTranslation/AutoText";import useAppLanguage from "../autoTranslation/useAppLanguage";
import NariLogoIcon from '../components/NariLogoIcon';


const { width, height } = Dimensions.get('window');

const SLIDES = [
{ id: '1', logo: true, emoji: '', title: "Women-Led Commerce", sub: "Empowering 6,000+ SHG women of West Bengal to sell directly to you — no middlemen, fair prices.", bg: ['#0F1822', '#1C2437'], accent: COLORS.primary },
{ id: '2', emoji: '🧵', title: "Reviving Bengal's Weaving Heritage", sub: "Baluchari, Tant, Jamdani, Murshidabad Silk — rare handloom treasures from master weavers.", bg: ['#0F1822', '#1C2437'], accent: COLORS.primaryLight },
{ id: '3', emoji: '🍯', title: "Pure Sundarbans Products", sub: "Wild honey, organic spices, pickles, and more — straight from forest and farmland to your home.", bg: ['#0F1822', '#1C2437'], accent: COLORS.primary },
{ id: '4', emoji: '🏺', title: "Tribal Crafts & Heritage Art", sub: "Dokra, Patachitra, Terracotta, Bamboo — authentic tribal artifacts that carry centuries of culture.", bg: ['#0F1822', '#1C2437'], accent: COLORS.primaryLight }];


export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);const lang = useAppLanguage();


  const goToRoleSelect = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'RoleSelect' }] })
    );
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      goToRoleSelect();
    }
  };

  const skip = () => goToRoleSelect();

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
        style={styles.scrollView}>
        
        {SLIDES.map((item, index) =>
        <LinearGradient key={item.id} colors={item.bg} style={styles.slide}>
            {/* Decorative accent circle behind emoji */}
            <View style={[styles.accentRing, { borderColor: COLORS.primary + '30' }]} />
            <View style={styles.emojiContainer}>
              {item.logo ? <NariLogoIcon size={120} /> : <Text style={styles.slideEmoji}>{item.emoji}</Text>}
            </View>
            {/* Step indicator */}
            <View style={styles.stepRow}>
              {SLIDES.map((_, i) =>
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]} />

            )}
            </View>
            <Text style={[styles.slideTitle, { color: item.accent }]}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.sub}</Text>
          </LinearGradient>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={skip} style={styles.skipBtn}>
            <Text style={styles.skipText}>{"Skip"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goNext} activeOpacity={0.85}>
            <LinearGradient
              colors={[COLORS.primaryDark, COLORS.primary]}
              style={styles.nextBtn}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              
              <Text style={styles.nextText}>
                {currentIndex === SLIDES.length - 1 ? `🚀 ${"Get Started"}` : `${"Next"} →`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollView: { flex: 1 },

  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 180
  },

  accentRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
    top: height * 0.18
  },

  emojiContainer: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(157,205,67,0.10)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
    borderWidth: 2, borderColor: COLORS.primary + '40',
    shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10
  },
  slideEmoji: { fontSize: 80 },

  stepRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(157,205,67,0.25)'
  },
  dotActive: {
    width: 28, height: 8, borderRadius: 4,
    backgroundColor: COLORS.primary
  },

  slideTitle: {
    fontSize: 28, fontWeight: '800', textAlign: 'center',
    marginBottom: 16, letterSpacing: -0.5, lineHeight: 36
  },
  slideSubtitle: {
    fontSize: 15, color: 'rgba(200,208,228,0.75)',
    textAlign: 'center', lineHeight: 24
  },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 28, paddingBottom: 44, paddingTop: 20,
    backgroundColor: 'transparent'
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 8 },
  skipText: { color: 'rgba(200,208,228,0.45)', fontSize: 15, fontWeight: '500' },
  nextBtn: {
    borderRadius: 50,
    paddingHorizontal: 36, paddingVertical: 15
  },
  nextText: { color: COLORS.dark, fontWeight: '800', fontSize: 15 }
});
