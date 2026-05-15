import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView,
  TouchableOpacity } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const CATEGORY_FILTER = ['All', 'Food', 'Textiles', 'Crafts'];

export default function ArtisansScreen({ navigation }) {const lang = useAppLanguage();

  const { artisans, adminStats, vendorProfile, vendorProducts } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  // Merge store artisans with live vendor profile
  const allArtisans = [
  ...artisans,
  // Include the active vendor as a live artisan entry
  {
    id: vendorProfile.id,
    name: vendorProfile.name,
    shg: vendorProfile.shgName,
    location: vendorProfile.location,
    avatar: vendorProfile.avatar,
    products: vendorProducts.length,
    rating: vendorProfile.rating,
    members: 16,
    story: `${vendorProfile.name} is an active vendor on Nari Samman with ${vendorProfile.totalOrders} orders fulfilled.`,
    totalEarnings: vendorProfile.totalEarnings,
    kycStatus: vendorProfile.kycStatus
  }];


  const filtered = allArtisans.filter((a) => {
    const matchSearch = !search ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.shg.toLowerCase().includes(search.toLowerCase()) ||
    a.location.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Artisans"}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{adminStats.totalArtisans.toLocaleString()}+</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Stats Banner */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.statsBanner}>
          {[
          { label: "Total Artisans", value: `${(adminStats.totalArtisans / 1000).toFixed(0)}K+`, color: COLORS.gold },
          { label: 'Active SHGs', value: adminStats.activeSHGs, color: COLORS.green },
          { label: 'Districts', value: '12', color: COLORS.teal },
          { label: 'Avg Rating', value: '4.8⭐', color: COLORS.warning }].
          map((s, i) =>
          <View key={i} style={styles.statItem}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={"Search artisans..."}
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch} />
          
          {search.length > 0 &&
          <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          }
        </View>

        {/* District Breakdown */}
        <View style={styles.districtCard}>
          <Text style={styles.districtTitle}>{"📍 District Distribution"}</Text>
          <View style={styles.districtGrid}>
            {[
            { name: 'North 24 PGS', count: '2,100', highlight: true },
            { name: 'Murshidabad', count: '1,200' },
            { name: 'Bankura', count: '800' },
            { name: 'Purulia', count: '650' },
            { name: 'Nadia', count: '520' },
            { name: 'Others', count: '730' }].
            map((d, i) =>
            <View key={i} style={[styles.districtChip, d.highlight && styles.districtChipHighlight]}>
                <Text style={[styles.districtCount, d.highlight && { color: COLORS.saffron }]}>{d.count}</Text>
                <Text style={[styles.districtName, d.highlight && { color: COLORS.textPrimary }]}>{d.name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Artisan List */}
        <View style={styles.list}>
          <Text style={styles.listMeta}>
            Showing {filtered.length} registered artisans (sample)
          </Text>
          {filtered.map((artisan, i) => {
            const isExpanded = expanded === artisan.id;
            return (
              <TouchableOpacity
                key={artisan.id}
                style={[styles.card, i > 0 && { marginTop: 10 }]}
                onPress={() => setExpanded(isExpanded ? null : artisan.id)}
                activeOpacity={0.8}>
                
                <View style={styles.cardTop}>
                  <View style={styles.avatarBox}>
                    <Text style={styles.avatar}>{artisan.avatar}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{artisan.name}</Text>
                      {artisan.kycStatus === 'verified' &&
                      <View style={styles.kycBadge}>
                          <Text style={styles.kycText}>{"✓ KYC"}</Text>
                        </View>
                      }
                    </View>
                    <Text style={styles.shgName}>{artisan.shg}</Text>
                    <Text style={styles.location}>📍 {artisan.location}</Text>
                    <View style={styles.statsRow}>
                      <Text style={styles.rating}>⭐ {artisan.rating}</Text>
                      <Text style={styles.dot}>·</Text>
                      <Text style={styles.statText}>👥 {artisan.members} members</Text>
                      <Text style={styles.dot}>·</Text>
                      <Text style={styles.statText}>🛍️ {artisan.products} products</Text>
                    </View>
                  </View>
                  <Text style={styles.expandArrow}>{isExpanded ? '▲' : '▼'}</Text>
                </View>

                {isExpanded &&
                <View style={styles.expandedSection}>
                    <View style={styles.expandDivider} />
                    <Text style={styles.story}>"{artisan.story}"</Text>
                    {artisan.totalEarnings &&
                  <View style={styles.earningsRow}>
                        <Text style={styles.earningsLabel}>{"Total Earnings"}</Text>
                        <Text style={styles.earningsValue}>
                          ₹{artisan.totalEarnings.toLocaleString()}
                        </Text>
                      </View>
                  }
                    <View style={styles.expandActions}>
                      <TouchableOpacity style={styles.expandBtn}>
                        <Text style={styles.expandBtnText}>{"📦 View Products"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.expandBtn, styles.expandBtnPrimary]}>
                        <Text style={[styles.expandBtnText, { color: COLORS.purple }]}>{"📢 Message"}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </TouchableOpacity>);

          })}
        </View>

        <View style={styles.noticeBanner}>
          <Text style={styles.noticeText}>
            📋 Showing {filtered.length} registered artisans. Full database of {adminStats.totalArtisans.toLocaleString()}+ artisans available via admin export.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small
  },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  countBadge: { backgroundColor: COLORS.purple, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  statsBanner: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: 'rgba(200,208,228,0.6)', marginTop: 3 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.darkCard, margin: 16, marginBottom: 12,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    ...SHADOWS.small
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  clearSearch: { fontSize: 16, color: COLORS.textMuted },
  districtCard: { backgroundColor: COLORS.darkCard, marginHorizontal: 16, marginBottom: 14, borderRadius: 16, padding: 14, ...SHADOWS.small },
  districtTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },
  districtGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  districtChip: { backgroundColor: COLORS.darkCard, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', minWidth: 90 },
  districtChipHighlight: { backgroundColor: COLORS.saffron + '20', borderWidth: 1.5, borderColor: COLORS.saffron + '60' },
  districtCount: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  districtName: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  list: { paddingHorizontal: 16 },
  listMeta: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },
  card: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16, ...SHADOWS.medium },
  cardTop: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  avatarBox: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
  avatar: { fontSize: 28 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  kycBadge: { backgroundColor: COLORS.success + '20', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  kycText: { fontSize: 10, color: COLORS.success, fontWeight: '700' },
  shgName: { fontSize: 12, color: COLORS.green, fontWeight: '600', marginTop: 3 },
  location: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  rating: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  dot: { fontSize: 12, color: COLORS.textMuted },
  statText: { fontSize: 11, color: COLORS.textMuted },
  expandArrow: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  expandedSection: { marginTop: 12 },
  expandDivider: { height: 1, backgroundColor: COLORS.darkCard, marginBottom: 12 },
  story: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 18, marginBottom: 12 },
  earningsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.success + '10', borderRadius: 10, padding: 10, marginBottom: 12 },
  earningsLabel: { fontSize: 12, color: COLORS.textSecondary },
  earningsValue: { fontSize: 14, fontWeight: '800', color: COLORS.success },
  expandActions: { flexDirection: 'row', gap: 10 },
  expandBtn: { flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.darkBorder, paddingVertical: 9, alignItems: 'center', backgroundColor: COLORS.darkCard },
  expandBtnPrimary: { backgroundColor: COLORS.purple + '15', borderColor: COLORS.purple + '40' },
  expandBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  noticeBanner: { margin: 16, backgroundColor: COLORS.info + '15', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.info + '30' },
  noticeText: { fontSize: 12, color: COLORS.info, lineHeight: 18 }
});