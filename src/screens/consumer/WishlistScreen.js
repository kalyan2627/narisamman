import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";import { formatText } from "../../autoTranslation/formatText";

function WishlistCard({ item, onAddToCart, onRemove, onPress }) {const lang = useAppLanguage();

  const [added, setAdded] = useState(false);
  const discount = item.mrp ? Math.round((1 - item.price / item.mrp) * 100) : 0;

  const handleAddToCart = () => {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.85}>
        <View style={styles.imgBox}>
          {item.image ?
          <Image source={imgSrc(item.image)} style={styles.img} resizeMode="cover" /> :

          <Text style={styles.imgEmoji}>{item.emoji}</Text>
          }
          {discount > 0 &&
          <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% off</Text>
            </View>
          }
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.mrp && <Text style={styles.mrp}>₹{item.mrp}</Text>}
          </View>
          {item.unit && <Text style={styles.unit}>{item.unit}</Text>}
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={[styles.addBtn, added && styles.addBtnAdded]}
          activeOpacity={0.8}>
          
          <Text style={styles.addBtnText}>{added ? '✓ Added' : "Add to Cart"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onRemove(item)} style={styles.removeBtn}>
          <Text style={styles.removeText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>);

}

export default function WishlistScreen({ navigation }) {const lang = useAppLanguage();

  const { wishlist, toggleWishlist, addToCart, navigate: navStore } = useStore();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Profile');
    }
  };

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{"My Wishlist"}</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>{"Your wishlist is empty"}</Text>
          <Text style={styles.emptySubtitle}>{"Save items you love for later"}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Explore')}
            style={styles.exploreBtn}>
            
            <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.exploreBtnGrad}>
              <Text style={styles.exploreBtnText}>{"Browse Products"} →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>);

  }

  // Pair items into rows of 2 for web-compatible grid
  const rows = [];
  for (let i = 0; i < wishlist.length; i += 2) {
    rows.push(wishlist.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"My Wishlist"}</Text>
        <Text style={styles.count}>{formatText("Items Count", { n: wishlist.length })}</Text>
      </View>

      {/* Move to Cart All Banner */}
      <TouchableOpacity
        style={styles.moveAllBtn}
        onPress={() => wishlist.forEach((item) => addToCart(item))}
        activeOpacity={0.8}>
        
        <Text style={styles.moveAllText}>🛒 {"Add All To Cart"}</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        
        {rows.map((row, rowIdx) =>
        <View key={rowIdx} style={styles.row}>
            {row.map((item) =>
          <WishlistCard
            key={item.id}
            item={item}
            onAddToCart={addToCart}
            onRemove={toggleWishlist}
            onPress={(product) => navigation.navigate('ProductDetail', { product })} />

          )}
            {/* Filler if odd item */}
            {row.length === 1 && <View style={styles.cardFiller} />}
          </View>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 14,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small
  },
  backBtn: { paddingVertical: 4, paddingRight: 8 },
  backText: { fontSize: 15, color: COLORS.saffron, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  count: { fontSize: 13, color: COLORS.textMuted, minWidth: 60, textAlign: 'right' },

  moveAllBtn: {
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    backgroundColor: COLORS.saffron + '15',
    borderWidth: 1.5, borderColor: COLORS.saffron + '50',
    borderRadius: 14, paddingVertical: 10, alignItems: 'center'
  },
  moveAllText: { fontSize: 14, fontWeight: '700', color: COLORS.saffron },

  scroll: { flex: 1 },
  listContent: { paddingHorizontal: 12, paddingTop: 12, flexGrow: 1 },

  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },

  card: {
    flex: 1,
    backgroundColor: COLORS.darkCard,
    borderRadius: 18,
    overflow: 'hidden',
    ...SHADOWS.small,
    maxWidth: '50%'
  },
  cardFiller: { flex: 1, maxWidth: '50%' },

  imgBox: {
    height: 130, backgroundColor: COLORS.darkCard,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative'
  },
  img: { fontSize: 58 },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.bengalRed, borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 3
  },
  discountText: { color: '#fff', fontSize: 9, fontWeight: '700' },

  info: { padding: 10 },
  name: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 17, minHeight: 34 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  price: { fontSize: 15, fontWeight: '700', color: COLORS.saffron },
  mrp: { fontSize: 11, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  unit: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  actions: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingBottom: 10
  },
  addBtn: {
    flex: 1, backgroundColor: COLORS.saffron,
    borderRadius: 10, paddingVertical: 8, alignItems: 'center'
  },
  addBtnAdded: { backgroundColor: COLORS.success },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 11 },
  removeBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center'
  },
  removeText: { fontSize: 14 },

  // Empty state
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32
  },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' },
  exploreBtn: { marginTop: 24, borderRadius: 50, overflow: 'hidden' },
  exploreBtnGrad: { paddingHorizontal: 32, paddingVertical: 14 },
  exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 }
});