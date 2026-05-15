import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Image, Linking, Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";



const { width } = Dimensions.get('window');

// Build per-product traceability data
const TRACEABILITY = {
  village: 'Sandeshkhali, North 24 Parganas',
  district: 'North 24 Parganas, West Bengal',
  harvestDate: 'February 2025',
  giTag: 'West Bengal GI Certified',
  fssai: 'FSSAI: 10020042013283',
  certifications: ['GI Tag', 'FSSAI Licensed', 'NABARD SHG Verified'],
  supplyChain: [
  { step: '🌾 Harvest / Weave', detail: 'Artisan SHG, Sandeshkhali' },
  { step: '🏭 Quality Check', detail: 'Nari Samman Warehouse, N24PGS' },
  { step: '📦 Pack & Dispatch', detail: 'Warehouse Hub → Courier' },
  { step: '🏠 Delivered', detail: 'Direct to your doorstep' }]

};

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, toggleWishlist, isWishlisted, artisans } = useStore();const lang = useAppLanguage();

  const [qty, setQty] = useState(1);
  const [cartToast, setCartToast] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const artisan = artisans.find((a) => a.id === product.artisanId);
  const discount = Math.round((1 - product.price / product.mrp) * 100);

  const localName = product.name;
  const localDesc = product.description;

  const handleWhatsApp = () => {
    const msg = `*${"Nari Samman"}* — ${"Artisan Products"}\n\n*${localName}*\n${"Price"}: ₹${product.price} (MRP ₹${product.mrp})\n${artisan ? `${"Made by"}: ${artisan.name}, ${artisan.shg}` : ''}\n\n${"Order now"}: https://narisamman.in`;
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.canOpenURL(url).
    then((ok) => ok ? Linking.openURL(url) : Alert.alert("WhatsApp not installed", "Please install WhatsApp to share.")).
    catch(() => Alert.alert("Error", "Could not open WhatsApp."));
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    setCartToast(true);
    setTimeout(() => setCartToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      {/* ScrollView wraps EVERYTHING — back button is inside, not floating */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Inline Top Bar (Back + Wishlist) */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Text style={styles.iconText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleWishlist(product)} style={styles.iconBtn}>
            <Text style={{ fontSize: 22 }}>{isWishlisted(product.id) ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imgWrapper}>
          {imgSrc(product.image) ?
          <Image source={imgSrc(product.image)} style={styles.imgSection} resizeMode="cover" /> :

          <LinearGradient colors={[COLORS.creamDark, COLORS.cream]} style={styles.imgSection}>
              <Text style={styles.productEmoji}>{product.emoji}</Text>
            </LinearGradient>
          }
          {product.badge &&
          <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          }
        </View>

        <View style={styles.content}>
          {/* Name & Rating */}
          <Text style={styles.name}>{localName}</Text>
          <Text style={styles.unit}>{"Per"} {product.unit}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.ratingNum}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>✓ {"In Stock"} ({product.stock})</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceBox}>
            <Text style={styles.price}>₹{product.price}</Text>
            <View style={styles.priceRight}>
              <Text style={styles.mrp}>MRP ₹{product.mrp}</Text>
              <View style={styles.discBadge}>
                <Text style={styles.discText}>{discount}% OFF</Text>
              </View>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            {(product.tags || []).map((t) =>
            <View key={t} style={styles.tag}>
                <Text style={styles.tagText}># {t}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{"About This Product"}</Text>
            <Text style={styles.description}>{localDesc}</Text>
          </View>

          {/* Artisan Story */}
          {artisan &&
          <LinearGradient colors={[COLORS.green + '15', COLORS.greenLight + '08']} style={styles.artisanCard}>
              <View style={styles.artisanHeader}>
                <Text style={styles.artisanEmoji}>{artisan.avatar}</Text>
                <View style={styles.artisanInfo}>
                  <Text style={styles.artisanName}>{artisan.name}</Text>
                  <Text style={styles.artisanShg}>{artisan.shg}</Text>
                  <Text style={styles.artisanLoc}>📍 {artisan.location}</Text>
                </View>
                <View style={styles.artisanRating}>
                  <Text style={styles.artisanRatingNum}>⭐ {artisan.rating}</Text>
                  <Text style={styles.artisanMembers}>{artisan.members} {"members"}</Text>
                </View>
              </View>
              <Text style={styles.artisanStory}>"{artisan.story}"</Text>
              <View style={styles.impactTag}>
                <Text style={styles.impactTagText}>🌱 {"Your purchase directly empowers this SHG"}</Text>
              </View>
            </LinearGradient>
          }

          {/* Product Traceability — DPR required */}
          <TouchableOpacity onPress={() => setShowTrace(!showTrace)} style={styles.traceHeader}>
            <View style={styles.traceHeaderLeft}>
              <Text style={styles.traceIcon}>🌱</Text>
              <View>
                <Text style={styles.traceTitle}>{"Product Traceability"}</Text>
                <Text style={styles.traceSub}>{"See exactly where this product comes from"}</Text>
              </View>
            </View>
            <Text style={styles.traceToggle}>{showTrace ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showTrace &&
          <View style={styles.traceBox}>
              <View style={styles.traceCerts}>
                {TRACEABILITY.certifications.map((c) =>
              <View key={c} style={styles.certBadge}>
                    <Text style={styles.certText}>✓ {c}</Text>
                  </View>
              )}
              </View>
              {[
            [`📍 ${"Village"}`, TRACEABILITY.village],
            [`🗺️ ${"District"}`, TRACEABILITY.district],
            [`📅 ${"Harvest / Made"}`, TRACEABILITY.harvestDate],
            [`🏷️ ${"GI Tag"}`, TRACEABILITY.giTag],
            [`🍽️ ${"FSSAI"}`, TRACEABILITY.fssai]].
            map(([lbl, val]) =>
            <View key={lbl} style={styles.traceRow}>
                  <Text style={styles.traceLbl}>{lbl}</Text>
                  <Text style={styles.traceVal}>{val}</Text>
                </View>
            )}
              <Text style={styles.traceChainTitle}>{"Supply Chain Journey"}</Text>
              {TRACEABILITY.supplyChain.map((s, i) =>
            <View key={i} style={styles.chainStep}>
                  <View style={styles.chainDot} />
                  {i < TRACEABILITY.supplyChain.length - 1 && <View style={styles.chainLine} />}
                  <View style={styles.chainInfo}>
                    <Text style={styles.chainStep_}>{s.step}</Text>
                    <Text style={styles.chainDetail}>{s.detail}</Text>
                  </View>
                </View>
            )}
            </View>
          }

          {/* WhatsApp Share */}
          <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsappBtn}>
            <Text style={styles.whatsappIcon}>💬</Text>
            <Text style={styles.whatsappText}>{"Order via WhatsApp"}</Text>
          </TouchableOpacity>

          {/* Shipping Info */}
          <View style={styles.shippingBox}>
            {[
            { emoji: '🏭', label: "Dispatched From", value: "Nari Samman Warehouse, Sandeshkhali" },
            { emoji: '🚚', label: "Estimated Delivery", value: "5–7 working days" },
            { emoji: '↩️', label: "Returns", value: "7-day easy return for damaged goods" }].
            map((row, i) =>
            <View key={i} style={styles.shippingRow}>
                <Text style={styles.shippingEmoji}>{row.emoji}</Text>
                <View>
                  <Text style={styles.shippingLabel}>{row.label}</Text>
                  <Text style={styles.shippingValue}>{row.value}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Qty Selector + CTA - inline, NOT fixed to bottom */}
          <View style={styles.bottomBar}>
            <View style={styles.qtySelector}>
              <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{qty}</Text>
              <TouchableOpacity onPress={() => setQty(Math.min(product.stock, qty + 1))} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleAddToCart} style={styles.addCartBtn}>
              <Text style={styles.addCartText}>{"Add to Cart"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBuyNow} style={styles.buyNowBtn}>
              <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.buyNowGrad}>
                <Text style={styles.buyNowText}>{"Buy Now"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>

      {/* Cart Toast — floats above content */}
      {cartToast &&
      <View style={styles.toast}>
          <Text style={styles.toastText}>🛒 {localName} {"added to cart!"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.toastCta}>{"Checkout"} →</Text>
          </TouchableOpacity>
        </View>
      }
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { flexGrow: 1 },

  // Top bar is now INSIDE scroll — no position:absolute
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 8,
    backgroundColor: COLORS.dark
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.darkCard,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.small
  },
  iconText: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary },

  imgWrapper: { position: 'relative' },
  imgSection: {
    height: 260, alignItems: 'center', justifyContent: 'center'
  },
  productEmoji: { fontSize: 110 },
  badge: {
    position: 'absolute', bottom: 16, left: 16,
    backgroundColor: COLORS.bengalRed, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 5
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 11 },

  content: { paddingHorizontal: 16, paddingTop: 20 },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 30 },
  unit: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  stars: { fontSize: 13 },
  ratingNum: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  reviews: { fontSize: 12, color: COLORS.textMuted },
  stockBadge: { backgroundColor: COLORS.success + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  stockText: { fontSize: 11, color: COLORS.success, fontWeight: '600' },

  priceBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, ...SHADOWS.small },
  price: { fontSize: 28, fontWeight: '800', color: COLORS.saffron },
  priceRight: { alignItems: 'flex-end', gap: 6 },
  mrp: { fontSize: 14, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  discBadge: { backgroundColor: COLORS.success + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  discText: { fontSize: 12, fontWeight: '700', color: COLORS.success },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  tag: { backgroundColor: COLORS.saffron + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  tagText: { fontSize: 12, color: COLORS.saffronDark, fontWeight: '500' },

  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  artisanCard: { marginTop: 20, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.greenLight + '40' },
  artisanHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  artisanEmoji: { fontSize: 40 },
  artisanInfo: { flex: 1 },
  artisanName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  artisanShg: { fontSize: 12, color: COLORS.green, marginTop: 2 },
  artisanLoc: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  artisanRating: { alignItems: 'flex-end' },
  artisanRatingNum: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  artisanMembers: { fontSize: 10, color: COLORS.textMuted, marginTop: 3 },
  artisanStory: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20 },
  impactTag: { marginTop: 10, backgroundColor: COLORS.green + '20', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
  impactTagText: { fontSize: 12, color: COLORS.green, fontWeight: '600' },

  // Traceability
  traceHeader: { marginTop: 20, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderLeftWidth: 3, borderLeftColor: COLORS.success },
  traceHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  traceIcon: { fontSize: 22 },
  traceTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  traceSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  traceToggle: { fontSize: 14, color: COLORS.success, fontWeight: '700' },
  traceBox: { backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 14, marginTop: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  traceCerts: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  certBadge: { backgroundColor: COLORS.success + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  certText: { fontSize: 11, color: COLORS.success, fontWeight: '700' },
  traceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  traceLbl: { fontSize: 11, color: COLORS.textMuted, flex: 1 },
  traceVal: { fontSize: 11, fontWeight: '600', color: COLORS.textPrimary, flex: 2, textAlign: 'right' },
  traceChainTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginTop: 12, marginBottom: 8 },
  chainStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 4, position: 'relative' },
  chainDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, marginTop: 5 },
  chainLine: { position: 'absolute', left: 4, top: 14, width: 2, height: 26, backgroundColor: COLORS.success + '40' },
  chainInfo: { flex: 1 },
  chainStep_: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  chainDetail: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  // WhatsApp
  whatsappBtn: { marginTop: 12, backgroundColor: '#25D36620', borderRadius: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#25D36640' },
  whatsappIcon: { fontSize: 18 },
  whatsappText: { fontSize: 13, fontWeight: '700', color: '#25D366' },
  shippingBox: { marginTop: 14, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, ...SHADOWS.small, gap: 14 },
  shippingRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  shippingEmoji: { fontSize: 20, marginTop: 2 },
  shippingLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
  shippingValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', marginTop: 2 },

  // CTA bar — inline inside scroll, not pinned
  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 24, gap: 10,
    backgroundColor: COLORS.darkCard, borderRadius: 20,
    padding: 12, ...SHADOWS.medium
  },
  qtySelector: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.darkCard, borderRadius: 12, paddingHorizontal: 6, paddingVertical: 6 },
  qtyBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: COLORS.saffron },
  qtyNum: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, minWidth: 24, textAlign: 'center' },
  addCartBtn: { flex: 1, backgroundColor: COLORS.saffron + '20', borderWidth: 1.5, borderColor: COLORS.saffron, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  addCartText: { color: COLORS.saffron, fontWeight: '700', fontSize: 13 },
  buyNowBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  buyNowGrad: { paddingVertical: 12, alignItems: 'center' },
  buyNowText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Cart Toast
  toast: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    backgroundColor: COLORS.darkCard, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    zIndex: 999, ...SHADOWS.large
  },
  toastText: { flex: 1, fontSize: 13, color: '#fff', fontWeight: '500' },
  toastCta: { fontSize: 13, color: COLORS.gold, fontWeight: '700', marginLeft: 12 }
});