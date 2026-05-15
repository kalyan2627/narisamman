import React, { useState, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Animated, FlatList, StatusBar, Alert, Image, Linking } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";import { CATEGORY_LABELS } from "../../autoTranslation/staticLabels";
import NariLogoIcon from '../../components/NariLogoIcon';



const { width } = Dimensions.get('window');

const CATEGORY_IDS = ['all', 'food', 'textiles', 'crafts'];
const CAT_EMOJIS = { all: '✨', food: '🍯', textiles: '🧵', crafts: '🏺' };

const BANNER_KEYS = [
{ id: 'b1', title: `Sundarbans Honey
Now Available!`, sub: "100% Wild & Pure", emoji: '🍯', gradient: ['#131D29', '#1C2437'] },
{ id: 'b2', title: `New Baluchari
Collection`, sub: "Rare Silk Sarees from Bishnupur", emoji: '🧵', gradient: ['#0F1822', '#243050'] },
{ id: 'b3', title: `Tribal Craft
Festival`, sub: "Dokra, Patachitra & More", emoji: '🏺', gradient: ['#131D29', '#1C2437'] }];


function BannerCard({ item }) {
  return (
    <LinearGradient colors={item.gradient} style={styles.bannerCard}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.sub}</Text>
        <TouchableOpacity style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>{"Shop Now"} →</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.bannerEmoji}>{item.emoji}</Text>
    </LinearGradient>);

}

function ProductCard({ product, onPress, onWishlist, isWishlisted }) {
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  const localName = product.name;
  return (
    <TouchableOpacity onPress={() => onPress(product)} style={styles.productCard} activeOpacity={0.9}>
      <View style={styles.productImageBox}>
        {imgSrc(product.image) ?
        <Image source={imgSrc(product.image)} style={styles.productImg} resizeMode="cover" /> :

        <Text style={styles.productEmoji}>{product.emoji}</Text>
        }
        {product.badge &&
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        }
        <TouchableOpacity style={styles.wishlistBtn} onPress={() => onWishlist(product)}>
          <Text style={{ fontSize: 16 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{localName}</Text>
        <Text style={styles.productUnit}>{product.unit}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.mrp}>₹{product.mrp}</Text>
          <Text style={styles.discount}>{discount}% off</Text>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>);

}

function ArtisanChip({ artisan }) {
  return (
    <View style={styles.artisanChip}>
      <Text style={styles.artisanChipEmoji}>{artisan.avatar}</Text>
      <View>
        <Text style={styles.artisanChipName}>{artisan.name}</Text>
        <Text style={styles.artisanChipShg}>{artisan.shg}</Text>
      </View>
      <View style={styles.artisanChipBadge}>
        <Text style={styles.artisanChipBadgeText}>{artisan.products} products</Text>
      </View>
    </View>);

}

export default function HomeScreen({ navigation }) {
  const { products, artisans, selectedCategory, setCategory, toggleWishlist, isWishlisted, user, getUnreadCount } = useStore();const lang = useAppLanguage();

  const [searchText, setSearchText] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.filter((p) => p.category === 'textiles').slice(0, 4);
  const unread = getUnreadCount();

  const headerBg = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['rgba(26,18,8,0)', 'rgba(26,18,8,0.98)'],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { backgroundColor: headerBg }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{"Nari Samman"} 🙏</Text>
            <View style={styles.brandRow}>
              <NariLogoIcon size={35} />
              <Text style={styles.headerBrand}>{"Nari Samman"}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.iconBtn}>
              <Text style={styles.iconText}>🔔</Text>
              {unread > 0 && <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{unread}</Text></View>}
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Explore')}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>{"Search…"}</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        
        {/* Hero Gradient */}
        <LinearGradient colors={['#0F1822', '#1C2437', '#243050']} style={styles.hero}>
          <View style={{ height: 150 }} />
          {/* Full-width Banner Carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveBanner(index);
            }}
            style={{ width }}>
            
            {BANNER_KEYS.map((item) => <BannerCard key={item.id} item={item} />)}
          </ScrollView>
          {/* Dot Indicators */}
          <View style={styles.dots}>
            {BANNER_KEYS.map((_, i) =>
            <View key={i} style={[styles.dot, activeBanner === i && styles.dotActive]} />
            )}
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Browse by Category"}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
            {CATEGORY_IDS.map((id) => {
              const label = CATEGORY_LABELS[id] || id;
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => {setCategory(id);navigation.navigate('Explore');}}
                  style={[styles.catChip, selectedCategory === id && styles.catChipActive]}>
                  
                  <Text style={styles.catEmoji}>{CAT_EMOJIS[id]}</Text>
                  <Text style={[styles.catLabel, selectedCategory === id && styles.catLabelActive]}>{label}</Text>
                </TouchableOpacity>);

            })}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{"Featured Products"}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAll}>{"View All →"}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={({ item }) =>
            <ProductCard
              product={item}
              onPress={(p) => navigation.navigate('ProductDetail', { product: p })}
              onWishlist={toggleWishlist}
              isWishlisted={isWishlisted(item.id)}
 />

            }
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }} />
          
        </View>

        {/* Artisan Stories Banner */}
        <LinearGradient colors={[COLORS.green + '20', COLORS.greenLight + '10']} style={styles.artisanBanner}>
          <Text style={styles.artisanBannerTitle}>🌱 {"Meet Our Artisans"}</Text>
          <Text style={styles.artisanBannerSub}>{"Every purchase directly empowers an SHG woman or tribal artisan"}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: 12 }}>
            {artisans.slice(0, 4).map((a) => <ArtisanChip key={a.id} artisan={a} />)}
          </ScrollView>
        </LinearGradient>

        {/* WhatsApp Commerce Banner — DPR required channel */}
        <TouchableOpacity
          style={styles.whatsappBanner}
          onPress={() => {
            const msg = 'Hi! I want to order from Nari Samman artisan products. Please share the catalogue!';
            const url = `whatsapp://send?phone=919876500000&text=${encodeURIComponent(msg)}`;
            Linking.canOpenURL(url).
            then((ok) => ok ? Linking.openURL(url) : Alert.alert('WhatsApp not available')).
            catch(() => {});
          }}>
          
          <View style={styles.whatsappLeft}>
            <Text style={styles.whatsappBannerIcon}>💬</Text>
            <View>
              <Text style={styles.whatsappBannerTitle}>{"Order via WhatsApp"}</Text>
              <Text style={styles.whatsappBannerSub}>{"Chat with your local agent · COD available"}</Text>
            </View>
          </View>
          <Text style={styles.whatsappArrow}>→</Text>
        </TouchableOpacity>


        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{"Trending Now"}</Text>
            <TouchableOpacity onPress={() => {setCategory('textiles');navigation.navigate('Explore');}}>
              <Text style={styles.seeAll}>{"View All →"}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newArrivals}
            renderItem={({ item }) =>
            <ProductCard
              product={item}
              onPress={(p) => navigation.navigate('ProductDetail', { product: p })}
              onWishlist={toggleWishlist}
              isWishlisted={isWishlisted(item.id)}
 />

            }
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }} />
          
        </View>

        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.impactSection}>
          <Text style={styles.impactTitle}>{"Our Impact 📊"}</Text>
          <View style={styles.impactGrid}>
            {[
            { label: "SHG Women", value: '6,000+', emoji: '👩' },
            { label: "Products", value: '342+', emoji: '📦' },
            { label: "Districts", value: '12', emoji: '📍' },
            { label: "Happy Buyers", value: '18.5K', emoji: '😊' }].
            map((s, i) =>
            <View key={i} style={styles.statCard}>
                <Text style={styles.statEmoji}>{s.emoji}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={{ height: 30 }} />
      </Animated.ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  greeting: { fontSize: 12, color: 'rgba(200,208,228,0.6)' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerBrand: { fontSize: 20, fontWeight: '800', color: COLORS.gold },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(200,208,228,0.1)', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 18 },
  notifBadge: { position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.bengalRed, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { fontSize: 8, color: '#fff', fontWeight: '700' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(157,205,67,0.15)'
  },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { color: 'rgba(200,208,228,0.5)', fontSize: 14 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  hero: { paddingBottom: 24 },
  bannerCard: {
    width: width,
    height: 170,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 28, paddingVertical: 24, overflow: 'hidden'
  },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', lineHeight: 28 },
  bannerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  bannerBtn: { marginTop: 14, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start' },
  bannerBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  bannerEmoji: { fontSize: 72, marginLeft: 10 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 12, paddingBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 20, backgroundColor: COLORS.darkCard, borderRadius: 3 },
  section: { paddingTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, paddingHorizontal: 16 },
  seeAll: { fontSize: 13, color: COLORS.saffron, fontWeight: '600' },
  categories: { paddingHorizontal: 16, gap: 10 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50,
    backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder,
    ...SHADOWS.small
  },
  catChipActive: { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron },
  catEmoji: { fontSize: 16 },
  catLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  catLabelActive: { color: '#fff' },
  productCard: {
    width: 170, backgroundColor: COLORS.darkCard, borderRadius: 16, overflow: 'hidden', ...SHADOWS.medium
  },
  productImageBox: {
    height: 140, backgroundColor: COLORS.darkCard,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden'
  },
  productImg: { width: '100%', height: 140 },
  productEmoji: { fontSize: 60 },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.bengalRed, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  wishlistBtn: { position: 'absolute', top: 8, right: 8 },
  productInfo: { padding: 12 },
  productName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 18 },
  productUnit: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  price: { fontSize: 16, fontWeight: '700', color: COLORS.saffron },
  mrp: { fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  discount: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  star: { fontSize: 11 },
  rating: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary },
  reviews: { fontSize: 11, color: COLORS.textMuted },
  artisanBanner: { margin: 16, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.greenLight + '30' },
  artisanBannerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.green },
  artisanBannerSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  artisanChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.darkCard, borderRadius: 50, paddingVertical: 8, paddingHorizontal: 14,
    ...SHADOWS.small
  },
  artisanChipEmoji: { fontSize: 20 },
  artisanChipName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  artisanChipShg: { fontSize: 10, color: COLORS.textMuted },
  artisanChipBadge: { backgroundColor: COLORS.green + '20', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  artisanChipBadgeText: { fontSize: 10, color: COLORS.green, fontWeight: '600' },
  impactSection: { margin: 16, borderRadius: 20, padding: 20 },
  impactTitle: { fontSize: 16, fontWeight: '700', color: COLORS.gold, marginBottom: 16 },
  impactGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(200,208,228,0.10)', borderRadius: 16,
    padding: 16, alignItems: 'center', minHeight: 110,
    justifyContent: 'center'
  },
  statEmoji: { fontSize: 26, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.gold },
  statLabel: { fontSize: 11, color: 'rgba(200,208,228,0.6)', marginTop: 3, textAlign: 'center' },
  // WhatsApp Commerce Banner
  whatsappBanner: { marginHorizontal: 16, marginBottom: 4, backgroundColor: '#25D36618', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: '#25D36640' },
  whatsappLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  whatsappBannerIcon: { fontSize: 30 },
  whatsappBannerTitle: { fontSize: 14, fontWeight: '800', color: '#25D366' },
  whatsappBannerSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  whatsappArrow: { fontSize: 20, color: '#25D366', fontWeight: '700' }
});
