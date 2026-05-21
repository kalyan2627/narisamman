import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { publicFetch, authFetch } from '../utils/api';
import { Platform } from 'react-native';

const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:9090/api' : 'http://localhost:9090/api';


// ─── Local Asset Images ───────────────────────────────────────────────────────
export const IMAGES = {
  sundarbanshoney: require('../../assets/Sundarbans Honey.jpg'),
  organicspices: require('../../assets/Organic Spices.jpg'),
  papad: require('../../assets/Papad.jpg'),
  jaggery: require('../../assets/Jaggery Products.jpg'),
  masalas: require('../../assets/Handmade Masalas.jpg'),
  bengalifood: require('../../assets/Traditional Bengali Food Products.jpg'),
  herbal: require('../../assets/Herbal Product.jpg'),
  tantSaree: require('../../assets/tant sarees.jpg'),
  baluchari: require('../../assets/Baluchari Sarees.jpg'),
  jamdani: require('../../assets/jamdani sarees.jpg'),
  bengalSilk: require('../../assets/bengal silk sarees.jpg'),
  dupattas: require('../../assets/handwoven dupattas.jpg'),
  tribalTextiles: require('../../assets/tribal textiles.jpg'),
  bambooCrafts: require('../../assets/bamboo crafts.jpg'),
  clayArtifacts: require('../../assets/clay artifacts.jpg'),
  juteProducts: require('../../assets/jute products.jpg'),
  handcraftedDecor: require('../../assets/handcrafted decorative.jpg'),
  ecoUtility: require('../../assets/eco-friendly utility.jpg'),
  handmadeGarments: require('../../assets/Handmade Garments.jpg'),
  bengaliApparel: require('../../assets/traditional bengali apparel.jpg'),
  dryFish: require('../../assets/Dry Fish.jpg'),
  mangoPickle: require('../../assets/mango_pickle.jpg'),
  bengalMustard: require('../../assets/bengal_mustard_oil.jpg'),
  dryFish2: require('../../assets/Dry Fish2.jpg')
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ARTISANS = [
{ id: 'a1', name: 'Mamata Biswas', shg: 'Sundarbans Honey SHG', location: 'Sandeshkhali, N24PGS', avatar: '👩‍🌾', products: 12, rating: 4.8, members: 24, story: 'Mamata leads a group of 24 women who collect pure Sundarbans honey. After years of selling to middlemen at throwaway prices, Nari Samman gave them direct market access.' },
{ id: 'a2', name: 'Rekha Mondal', shg: 'Tant Weavers Collective', location: 'Nadia, West Bengal', avatar: '🧵', products: 18, rating: 4.9, members: 16, story: 'Rekha\'s family has woven Tant sarees for 4 generations. Nari Samman helped her reach buyers across India without any middleman.' },
{ id: 'a3', name: 'Priya Das', shg: 'Tribal Craft Circle', location: 'Purulia, West Bengal', avatar: '🏺', products: 9, rating: 4.7, members: 30, story: 'Priya leads a tribal craft group creating bamboo and clay artifacts that tell stories of their ancient Santhali culture.' },
{ id: 'a4', name: 'Anita Soren', shg: 'Jamdani Heritage Weavers', location: 'Murshidabad, West Bengal', avatar: '🌺', products: 22, rating: 5.0, members: 12, story: 'Anita is a master Jamdani weaver whose intricate patterns have been recognized at national textile exhibitions.' },
{ id: 'a5', name: 'Lakshmi Roy', shg: 'Baluchari Revival Group', location: 'Bishnupur, Bankura', avatar: '🦋', products: 15, rating: 4.8, members: 8, story: 'Lakshmi is reviving the near-extinct Baluchari tradition. Each saree takes 3–6 months to weave and tells Mahabharata stories in silk.' },
{ id: 'a6', name: 'Savitri Mahato', shg: 'Spice Sisters SHG', location: 'Jhargram, West Bengal', avatar: '🌶️', products: 11, rating: 4.6, members: 20, story: 'Savitri\'s group handgrinds traditional spice blends using recipes passed down for generations. No preservatives, pure tradition.' }];


const MOCK_PRODUCTS = [
{ id: 'p1', name: 'Pure Sundarbans Forest Honey', category: 'food', price: 480, mrp: 650, unit: '500g', emoji: '🍯', image: IMAGES.sundarbanshoney, artisanId: 'a1', description: 'Single-origin wild honey collected from the UNESCO World Heritage Sundarbans forest by tribal honey hunters. Dark amber, rich, slightly smoky with floral notes.', tags: ['organic', 'wild', 'certified'], rating: 4.9, reviews: 234, stock: 45, badge: 'Best Seller' },
{ id: 'p2', name: 'Mango Pickle – Traditional Recipe', category: 'food', price: 180, mrp: 220, unit: '400g', emoji: '🥭', image: IMAGES.mangoPickle, artisanId: 'a6', description: 'Handmade Bengal-style mango achaar using mustard oil and traditional spices. No artificial preservatives.', tags: ['handmade', 'traditional'], rating: 4.7, reviews: 89, stock: 120 },
{ id: 'p3', name: 'Bengal Mustard – Cold Press', category: 'food', price: 220, mrp: 280, unit: '500ml', emoji: '🌻', image: IMAGES.bengalMustard, artisanId: 'a6', description: 'Cold-pressed raw mustard oil from village farms, full of natural pungency and nutrition.', tags: ['cold-pressed', 'pure'], rating: 4.6, reviews: 67, stock: 80 },
{ id: 'p4', name: 'Handmade Papad – Moong Dal', category: 'food', price: 120, mrp: 160, unit: '250g', emoji: '🫓', image: IMAGES.papad, artisanId: 'a1', description: 'Sun-dried moong dal papads handrolled by SHG women. Crisp, thin, and full of village flavor.', tags: ['sun-dried', 'handmade'], rating: 4.5, reviews: 45, stock: 200 },
{ id: 'p5', name: 'Jaggery – Palm Sugar', category: 'food', price: 160, mrp: 200, unit: '1kg', emoji: '🍫', image: IMAGES.jaggery, artisanId: 'a6', description: 'Traditional palm jaggery from date palms of West Bengal. Deep caramel flavor, zero refining.', tags: ['natural', 'unrefined'], rating: 4.8, reviews: 112, stock: 60, badge: 'Trending' },
{ id: 'p6', name: 'Organic Turmeric Powder', category: 'food', price: 140, mrp: 180, unit: '200g', emoji: '🌿', image: IMAGES.organicspices, artisanId: 'a6', description: 'High-curcumin turmeric grown without pesticides on tribal farmlands.', tags: ['organic', 'high-curcumin'], rating: 4.7, reviews: 78, stock: 150 },
{ id: 'p7', name: 'Sundarbans Wild Beeswax', category: 'food', price: 320, mrp: 450, unit: '200g', emoji: '🕯️', image: IMAGES.herbal, artisanId: 'a1', description: 'Pure natural beeswax harvested alongside honey collection. Used for skincare and candle-making.', tags: ['natural', 'multipurpose'], rating: 4.6, reviews: 34, stock: 30 },
{ id: 'p8', name: 'Heritage Rice – Gobindobhog', category: 'food', price: 280, mrp: 340, unit: '2kg', emoji: '🌾', image: IMAGES.bengalifood, artisanId: 'a6', description: 'The legendary GI-tagged Gobindobhog rice of Bengal. Aromatic, short-grain, used in pujas and special meals.', tags: ['GI-tagged', 'aromatic'], rating: 4.9, reviews: 156, stock: 40, badge: 'GI Tagged' },
{ id: 'p9', name: 'Tant Saree – Crimson Border', category: 'textiles', price: 1200, mrp: 2000, unit: 'piece', emoji: '👘', image: IMAGES.tantSaree, artisanId: 'a2', description: 'Handwoven Tant cotton saree with traditional crimson jamdani border. Breathable and perfect for Bengal summers. Each piece is unique.', tags: ['handwoven', 'traditional', 'cotton'], rating: 4.8, reviews: 143, stock: 22, badge: 'Artisan Made' },
{ id: 'p10', name: 'Baluchari Silk – Mahabharata Motif', category: 'textiles', price: 8500, mrp: 14000, unit: 'piece', emoji: '🧵', image: IMAGES.baluchari, artisanId: 'a5', description: 'Exquisite Baluchari silk saree featuring Mahabharata scenes woven in silk thread. Took 4 months to weave. GI-certified artisan product.', tags: ['silk', 'GI-certified', 'heirloom'], rating: 5.0, reviews: 28, stock: 3, badge: 'Rare' },
{ id: 'p11', name: 'Jamdani Saree – White & Gold', category: 'textiles', price: 4200, mrp: 6500, unit: 'piece', emoji: '✨', image: IMAGES.jamdani, artisanId: 'a4', description: 'UNESCO heritage Jamdani weave with gold thread floral motifs. The air woven into the fabric gives it an ethereal quality.', tags: ['UNESCO', 'silk', 'heritage'], rating: 4.9, reviews: 67, stock: 8, badge: 'UNESCO Heritage' },
{ id: 'p12', name: 'Murshidabad Silk Saree – Natural Dye', category: 'textiles', price: 3600, mrp: 5200, unit: 'piece', emoji: '💛', image: IMAGES.bengalSilk, artisanId: 'a4', description: 'Pure mulberry silk from Murshidabad looms, dyed with natural indigo and turmeric. Lustrous, lightweight, and eco-friendly.', tags: ['pure-silk', 'natural-dye'], rating: 4.8, reviews: 92, stock: 12 },
{ id: 'p13', name: 'Tant Dupatta – Indigo Block Print', category: 'textiles', price: 650, mrp: 950, unit: 'piece', emoji: '🟦', image: IMAGES.dupattas, artisanId: 'a2', description: 'Hand block-printed cotton dupatta using indigo natural dye. Pairs beautifully with any Indian outfit.', tags: ['block-print', 'natural-dye'], rating: 4.6, reviews: 54, stock: 35 },
{ id: 'p14', name: 'Tribal Textile Stole – Santhali', category: 'textiles', price: 780, mrp: 1100, unit: 'piece', emoji: '🌺', image: IMAGES.tribalTextiles, artisanId: 'a3', description: 'Handloom stole featuring traditional Santhali tribal motifs in earthy tones. Rare and culturally significant.', tags: ['tribal', 'handloom', 'rare'], rating: 4.7, reviews: 31, stock: 18, badge: 'Tribal Art' },
{ id: 'p15', name: 'Bamboo Fruit Basket', category: 'crafts', price: 450, mrp: 700, unit: 'piece', emoji: '🧺', image: IMAGES.bambooCrafts, artisanId: 'a3', description: 'Hand-woven bamboo basket by Purulia tribal women. Strong, eco-friendly, and a perfect kitchen companion.', tags: ['eco-friendly', 'bamboo', 'tribal'], rating: 4.5, reviews: 76, stock: 50 },
{ id: 'p16', name: 'Clay Terracotta Horse', category: 'crafts', price: 380, mrp: 550, unit: 'piece', emoji: '🐴', image: IMAGES.clayArtifacts, artisanId: 'a3', description: 'Bankura\'s iconic terracotta horse, handcrafted by tribal potters. GI-tagged art form, perfect as decor or gift.', tags: ['GI-tagged', 'terracotta', 'tribal'], rating: 4.8, reviews: 112, stock: 25, badge: 'GI Tagged' },
{ id: 'p17', name: 'Jute Tote Bag – Embroidered', category: 'crafts', price: 320, mrp: 480, unit: 'piece', emoji: '👜', image: IMAGES.juteProducts, artisanId: 'a1', description: 'Eco-friendly jute bag with Kantha embroidery by SHG women. Sturdy, stylish, and sustainable.', tags: ['eco-friendly', 'jute', 'embroidered'], rating: 4.6, reviews: 89, stock: 65 },
{ id: 'p18', name: 'Dokra Metal Art – Tribal Couple', category: 'crafts', price: 1200, mrp: 1800, unit: 'piece', emoji: '🗿', image: IMAGES.handcraftedDecor, artisanId: 'a3', description: 'Ancient lost-wax cast Dokra craft from West Bengal tribes. This figurine took 3 weeks to cast and finish.', tags: ['dokra', 'lost-wax', 'ancient'], rating: 4.9, reviews: 43, stock: 10, badge: 'Heritage Craft' },
{ id: 'p19', name: 'Patachitra Scroll Painting', category: 'crafts', price: 850, mrp: 1300, unit: 'piece', emoji: '🎨', image: IMAGES.handcraftedDecor, artisanId: 'a5', description: 'Traditional scroll painting by Medinipur Patua artists depicting folk tales. Painted with natural pigments on hand-made paper.', tags: ['traditional', 'folk-art', 'hand-painted'], rating: 4.7, reviews: 37, stock: 15 },
{ id: 'p20', name: 'Sabai Grass Utility Box', category: 'crafts', price: 280, mrp: 400, unit: 'piece', emoji: '📦', image: IMAGES.ecoUtility, artisanId: 'a3', description: 'Handwoven sabai grass storage box. Biodegradable, lightweight, perfect for organizing small items.', tags: ['eco-friendly', 'sabai', 'handwoven'], rating: 4.4, reviews: 28, stock: 80 }];


// Real-world order statuses:
// Consumer sees: confirmed → packed → shipped → delivered (+ awaiting_payment after delivery)
// Vendor drives: confirmed → packed → shipped → delivered
// Payment: consumer pays AFTER delivery (COD/post-delivery), amount goes to vendor pending_payment
// Vendor requests payout from admin, admin pays → earned

const MOCK_ORDERS = [
{ id: 'ord001', date: '2025-05-08', status: 'delivered', paymentStatus: 'paid', items: [{ productId: 'p1', qty: 2, name: 'Pure Sundarbans Forest Honey', price: 480, unit: '500g', emoji: '🍯' }, { productId: 'p9', qty: 1, name: 'Tant Saree – Crimson Border', price: 1200, unit: 'piece', emoji: '👘' }], total: 2160, address: 'Mumbai, Maharashtra', tracking: 'Delivered on May 10' },
{ id: 'ord002', date: '2025-05-06', status: 'shipped', paymentStatus: 'pending', items: [{ productId: 'p5', qty: 3, name: 'Jaggery – Palm Sugar', price: 160, unit: '1kg', emoji: '🍫' }], total: 480, address: 'Delhi, NCR', tracking: 'Out for delivery' },
{ id: 'ord003', date: '2025-05-03', status: 'packed', paymentStatus: 'pending', items: [{ productId: 'p10', qty: 1, name: 'Baluchari Silk – Mahabharata Motif', price: 8500, unit: 'piece', emoji: '🧵' }], total: 8500, address: 'Bangalore, Karnataka', tracking: 'Quality checked at warehouse' }];


// Vendor sees same orders with their own status view
const MOCK_VENDOR_ORDERS = [
{ id: 'vo001', buyer: 'Priya S.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'confirmed', paymentStatus: 'pending', date: '2025-05-10', consumerOrderId: 'ext001', shgName: 'Tant Weavers Collective' },
{ id: 'vo002', buyer: 'Ananya M.', item: 'Tant Dupatta – Indigo', qty: 2, amount: 1300, status: 'packed', paymentStatus: 'pending', date: '2025-05-09', consumerOrderId: 'ext002', shgName: 'Tant Weavers Collective' },
{ id: 'vo003', buyer: 'Ritu T.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'sent_to_logistics', paymentStatus: 'pending', date: '2025-05-07', consumerOrderId: 'ext003', shgName: 'Tant Weavers Collective' },
{ id: 'vo004', buyer: 'Meena K.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'pending_payment', date: '2025-05-01', consumerOrderId: 'ext004' },
{ id: 'vo005', buyer: 'Sunita R.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'pending_payment', date: '2025-04-28', consumerOrderId: 'ext005' },
{ id: 'vo006', buyer: 'Kavita D.', item: 'Tant Dupatta – Indigo', qty: 3, amount: 1950, status: 'delivered', paymentStatus: 'paid', date: '2025-04-25', consumerOrderId: 'ext006' },
{ id: 'vo007', buyer: 'Lata P.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-04-22', consumerOrderId: 'ext007' },
{ id: 'vo008', buyer: 'Deepa M.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-04-20', consumerOrderId: 'ext008' },
{ id: 'vo009', buyer: 'Radha V.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-04-18', consumerOrderId: 'ext009' },
{ id: 'vo010', buyer: 'Pooja N.', item: 'Tant Saree – Crimson Border', qty: 2, amount: 2400, status: 'delivered', paymentStatus: 'paid', date: '2025-04-15', consumerOrderId: 'ext010' },
{ id: 'vo011', buyer: 'Asha B.', item: 'Tant Dupatta – Indigo', qty: 1, amount: 650, status: 'delivered', paymentStatus: 'paid', date: '2025-04-12', consumerOrderId: 'ext011' },
{ id: 'vo012', buyer: 'Nisha C.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-04-10', consumerOrderId: 'ext012' },
{ id: 'vo013', buyer: 'Geeta L.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-04-08', consumerOrderId: 'ext013' },
{ id: 'vo014', buyer: 'Mala J.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-04-05', consumerOrderId: 'ext014' },
{ id: 'vo015', buyer: 'Usha K.', item: 'Tant Dupatta – Indigo', qty: 2, amount: 1300, status: 'delivered', paymentStatus: 'paid', date: '2025-04-02', consumerOrderId: 'ext015' },
{ id: 'vo016', buyer: 'Rekha A.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-30', consumerOrderId: 'ext016' },
{ id: 'vo017', buyer: 'Smita H.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-03-27', consumerOrderId: 'ext017' },
{ id: 'vo018', buyer: 'Tara W.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-25', consumerOrderId: 'ext018' },
{ id: 'vo019', buyer: 'Poonam G.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-22', consumerOrderId: 'ext019' },
{ id: 'vo020', buyer: 'Varsha F.', item: 'Tant Dupatta – Indigo', qty: 2, amount: 1300, status: 'delivered', paymentStatus: 'paid', date: '2025-03-20', consumerOrderId: 'ext020' },
{ id: 'vo021', buyer: 'Chitra E.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-18', consumerOrderId: 'ext021' },
{ id: 'vo022', buyer: 'Jyoti D.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-03-15', consumerOrderId: 'ext022' },
{ id: 'vo023', buyer: 'Shalini C.', item: 'Tant Saree – Crimson Border', qty: 2, amount: 2400, status: 'delivered', paymentStatus: 'paid', date: '2025-03-12', consumerOrderId: 'ext023' },
{ id: 'vo024', buyer: 'Kamla B.', item: 'Tant Dupatta – Indigo', qty: 3, amount: 1950, status: 'delivered', paymentStatus: 'paid', date: '2025-03-10', consumerOrderId: 'ext024' },
{ id: 'vo025', buyer: 'Saroj A.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-07', consumerOrderId: 'ext025' },
{ id: 'vo026', buyer: 'Bimla Z.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-05', consumerOrderId: 'ext026' },
{ id: 'vo027', buyer: 'Hemlata Y.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-03-02', consumerOrderId: 'ext027' },
{ id: 'vo028', buyer: 'Indira X.', item: 'Tant Dupatta – Indigo', qty: 1, amount: 650, status: 'delivered', paymentStatus: 'paid', date: '2025-02-28', consumerOrderId: 'ext028' },
{ id: 'vo029', buyer: 'Janaki W.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-02-25', consumerOrderId: 'ext029' },
{ id: 'vo030', buyer: 'Kamala V.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-02-22', consumerOrderId: 'ext030' },
{ id: 'vo031', buyer: 'Lalita U.', item: 'Tant Saree – Crimson Border', qty: 2, amount: 2400, status: 'delivered', paymentStatus: 'paid', date: '2025-02-18', consumerOrderId: 'ext031' },
{ id: 'vo032', buyer: 'Mamta T.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-02-15', consumerOrderId: 'ext032' }];


const MOCK_VENDOR_PRODUCTS = [
{ id: 'vp1', name: 'Tant Saree – Crimson Border', category: 'textiles', price: 1200, mrp: 2000, unit: 'piece', image: IMAGES.tantSaree, artisanId: 'a2', description: 'Handwoven Tant cotton saree with traditional crimson jamdani border.', tags: ['handwoven', 'traditional', 'cotton'], rating: 4.8, reviews: 143, stock: 22, badge: 'Best Seller' },
{ id: 'vp2', name: 'Jamdani Saree – White & Gold', category: 'textiles', price: 4200, mrp: 6500, unit: 'piece', image: IMAGES.jamdani, artisanId: 'a2', description: 'UNESCO heritage Jamdani weave with gold thread floral motifs.', tags: ['UNESCO', 'silk', 'heritage'], rating: 4.9, reviews: 67, stock: 8, badge: 'UNESCO Heritage' },
{ id: 'vp3', name: 'Murshidabad Silk – Natural Dye', category: 'textiles', price: 3600, mrp: 5200, unit: 'piece', image: IMAGES.bengalSilk, artisanId: 'a2', description: 'Pure mulberry silk from Murshidabad looms, dyed with natural indigo.', tags: ['pure-silk', 'natural-dye'], rating: 4.8, reviews: 92, stock: 12 },
{ id: 'vp4', name: 'Tant Dupatta – Indigo Block Print', category: 'textiles', price: 650, mrp: 950, unit: 'piece', image: IMAGES.dupattas, artisanId: 'a2', description: 'Hand block-printed cotton dupatta using indigo natural dye.', tags: ['block-print', 'natural-dye'], rating: 4.6, reviews: 54, stock: 35 },
{ id: 'vp5', name: 'Tribal Textile Stole – Santhali', category: 'textiles', price: 780, mrp: 1100, unit: 'piece', image: IMAGES.tribalTextiles, artisanId: 'a2', description: 'Handloom stole featuring traditional Santhali tribal motifs in earthy tones.', tags: ['tribal', 'handloom', 'rare'], rating: 4.7, reviews: 31, stock: 18, badge: 'Tribal Art' },
{ id: 'vp6', name: 'Handloom Stole – Kantha Work', category: 'textiles', price: 890, mrp: 1300, unit: 'piece', image: IMAGES.dupattas, artisanId: 'a2', description: 'Cotton stole with Kantha embroidery depicting rural Bengal scenes.', tags: ['kantha', 'embroidery', 'cotton'], rating: 4.5, reviews: 29, stock: 20 },
{ id: 'vp7', name: 'Jamdani Table Runner', category: 'textiles', price: 780, mrp: 1100, unit: 'piece', image: IMAGES.jamdani, artisanId: 'a2', description: 'Traditional Jamdani-weave table runner, perfect for festive dining.', tags: ['jamdani', 'home-decor', 'handwoven'], rating: 4.6, reviews: 17, stock: 30 },
{ id: 'vp8', name: 'Tant Saree – Mustard & Black', category: 'textiles', price: 1350, mrp: 2100, unit: 'piece', image: IMAGES.tantSaree, artisanId: 'a2', description: 'Classic mustard and black contrast Tant saree, timeless Bengal style.', tags: ['tant', 'classic', 'contrast'], rating: 4.8, reviews: 51, stock: 18 },
{ id: 'vp9', name: 'Muslin Kurta Fabric – 3m', category: 'textiles', price: 1100, mrp: 1600, unit: 'piece', image: IMAGES.handmadeGarments, artisanId: 'a2', description: 'Fine muslin fabric, soft as air. Cut for a full kurta with 3 metres.', tags: ['muslin', 'fabric', 'premium'], rating: 4.7, reviews: 23, stock: 25 },
{ id: 'vp10', name: 'Block-Print Linen Saree', category: 'textiles', price: 1800, mrp: 2600, unit: 'piece', image: IMAGES.bengaliApparel, artisanId: 'a2', description: 'Handcrafted linen saree with hand block print in earthy Bengal tones.', tags: ['linen', 'block-print', 'natural'], rating: 4.9, reviews: 44, stock: 10, badge: 'New Arrival' }];


// Payout requests: vendor requests → admin approves/pays
const MOCK_PAYOUT_REQUESTS = [
{ id: 'pr001', vendorId: 'v1', vendorName: 'Rekha Mondal', amount: 4800, status: 'paid', requestedAt: '2025-04-30', paidAt: '2025-05-01', ref: 'NS-PAY-0412', orders: ['vo006', 'vo007'] },
{ id: 'pr002', vendorId: 'v1', vendorName: 'Rekha Mondal', amount: 3600, status: 'paid', requestedAt: '2025-03-31', paidAt: '2025-04-01', ref: 'NS-PAY-0390', orders: ['vo008', 'vo009'] }];


const todayDate = () => new Date().toISOString().split('T')[0];

const ORDER_TRACKING_MESSAGES = {
  confirmed: 'Order confirmed – vendor is preparing your items',
  packed: 'Items packed and quality-checked by SHG',
  sent_to_logistics: 'Handed to IS&SF logistics hub for dispatch',
  shipped: 'Your order is on the way with logistics partner',
  delivered: 'Delivered successfully – Thank you for your purchase!'
};

const DISPATCH_TO_ORDER = {
  at_hub: {
    consumerStatus: 'packed',
    vendorStatus: 'sent_to_logistics',
    tracking: 'Reached IS&SF logistics hub. Dispatch team is preparing shipment.',
    title: 'At Logistics Hub'
  },
  dispatched: {
    consumerStatus: 'shipped',
    vendorStatus: 'shipped',
    tracking: 'Dispatched from IS&SF logistics hub and handed to delivery partner.',
    title: 'Dispatched'
  },
  in_transit: {
    consumerStatus: 'shipped',
    vendorStatus: 'shipped',
    tracking: 'In transit to customer address. Delivery partner is moving the shipment.',
    title: 'In Transit'
  },
  delivered: {
    consumerStatus: 'delivered',
    vendorStatus: 'delivered',
    tracking: 'Delivered successfully – COD/payment collected and order closed.',
    title: 'Delivered'
  }
};

const makeTrackingEvent = (status, title, message, actor = 'System') => ({
  id: `track_${status}_${Date.now()}`,
  status,
  title,
  message,
  actor,
  date: todayDate()
});

const appendTrackingEvent = (timeline, status, title, message, actor = 'System') => {
  const safeTimeline = Array.isArray(timeline) ? timeline : [];
  return [
    ...safeTimeline,
    makeTrackingEvent(status, title, message, actor)
  ];
};

const getRelatedConsumerOrder = (state, dispatch, vendorOrder) => {
  const consumerId = dispatch?.consumerOrderId || vendorOrder?.consumerOrderId || (String(dispatch?.orderId || '').startsWith('ord') ? dispatch.orderId : null);
  return consumerId ? state.orders.find((o) => o.id === consumerId) : null;
};

const getRelatedVendorOrders = (state, dispatch) => {
  const vendorId = dispatch?.vendorOrderId || (String(dispatch?.orderId || '').startsWith('vo') ? dispatch.orderId : null);
  if (vendorId) return state.vendorOrders.filter((o) => o.id === vendorId);
  const consumerId = dispatch?.consumerOrderId || (String(dispatch?.orderId || '').startsWith('ord') ? dispatch.orderId : null);
  if (consumerId) return state.vendorOrders.filter((o) => o.consumerOrderId === consumerId);
  return [];
};

// ─── Store ────────────────────────────────────────────────────────────────────
const useStore = create((set, get) => ({
  // Navigation / Role
  currentRole: null,
  currentScreen: 'Splash',
  isLoggedIn: false,
  token: null,
  userRole: null,

  // ─── App Language ─────────────────────────────────────────────────────────
  language: 'en', // 'en' | 'bn' | 'hi'

  // ─── SHG Pending Registrations (admin must approve before vendor can login) ──
  pendingSHGRegistrations: [],

  // User Profile
  user: {
    id: 'u1',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 98765 43210',
    avatar: '👤',
    addresses: [] // Loaded from backend via fetchAddresses

  },

  // Vendor / Artisan profile
  vendorProfile: {
    id: 'v1',
    name: 'Rekha Mondal',
    shgName: 'Tant Weavers Collective',
    location: 'Nadia, West Bengal',
    phone: '+91 97650 12345',
    kycStatus: 'verified',
    bankLinked: true,
    totalOrders: 32,
    rating: 4.9,
    avatar: '🧵'
  },

  // Products
  products: [],
  artisans: MOCK_ARTISANS,

  // Consumer State
  cart: [],
  wishlist: [],
  orders: [],
  searchQuery: '',
  selectedCategory: 'all',

  // Vendor State
  vendorOrders: MOCK_VENDOR_ORDERS,
  vendorProducts: MOCK_VENDOR_PRODUCTS,

  // Payment / Payout State
  payoutRequests: MOCK_PAYOUT_REQUESTS,
  // vendorNotifications: payout notifications for vendor
  vendorNotifications: [],

  // Admin State — totalOrders is now derived live from orders array
  adminStats: {
    totalRevenue: 8240000,
    activeSHGs: 214,
    pendingApprovals: 4,
    totalArtisans: 6000,
    productsListed: 342,
    monthlyGrowth: 23.4,
    happyCustomers: 18500
  },
  pendingProducts: MOCK_PRODUCTS.slice(0, 4).map((p) => ({ ...p, status: 'pending' })),
  allVendors: MOCK_ARTISANS,
  notifications: [
  { id: 'n1', type: 'order', message: 'Your Tant Saree order has been dispatched!', time: '2 min ago', read: false },
  { id: 'n2', type: 'promo', message: '🎉 New Baluchari collection just arrived!', time: '1 hr ago', read: false },
  { id: 'n3', type: 'offer', message: '15% off on all Sundarbans Honey today!', time: '3 hr ago', read: true }],


  // ─── Derived Helpers ──────────────────────────────────────────────────────
  // Live total orders = consumer orders placed + mock vendor historical orders not linked to consumer
  getTotalOrders: () => {
    const { orders, vendorOrders } = get();
    // Count unique consumer orders + standalone vendor orders not linked to any consumer order
    const consumerOrderIds = new Set(orders.map((o) => o.id));
    const standaloneVendorOrders = vendorOrders.filter((o) =>
    !o.consumerOrderId || !consumerOrderIds.has(o.consumerOrderId)
    );
    return orders.length + standaloneVendorOrders.length;
  },

  // ─── Actions ───────────────────────────────────────────────────────────────
  setRole: (role) => set({ currentRole: role, isLoggedIn: true }),
  setScreen: (screen) => set({ currentScreen: screen }),
  logout: () => {
    SecureStore.deleteItemAsync('naari_jwt_token').catch((e) => console.error("SecureStore error", e));
    set({
      currentRole: null,
      isLoggedIn: false,
      token: null,
      userRole: null,
      currentScreen: 'RoleSelect',
      cart: [],
      wishlist: []
    });
  },
  setLanguage: (lang) => set({ language: lang }),

  authHeader: () => {
    const token = get().token;
    return token ? { 'Authorization': 'Bearer ' + token } : {};
  },

  restoreSession: async () => {
    try {
      const stored = await SecureStore.getItemAsync('naari_jwt_token');
      if (stored) {
        const parts = stored.split('.');
        if (parts.length === 3) {
          // Decode payload safely using pure JS base64 decoder
          const base64Url = parts[1];
          let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) { base64 += '='; }
          
          let decodedStr = '';
          if (typeof atob !== 'undefined') {
            decodedStr = atob(base64);
          } else {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            let buffer = 0;
            let bits = 0;
            for (let i = 0; i < base64.length; i++) {
              const char = base64[i];
              const idx = chars.indexOf(char);
              if (idx === -1 || char === '=') continue;
              buffer = (buffer << 6) | idx;
              bits += 6;
              if (bits >= 8) {
                bits -= 8;
                decodedStr += String.fromCharCode((buffer >> bits) & 0xff);
              }
            }
          }
          
          const payload = JSON.parse(decodedStr);
          const isExpired = payload.exp && payload.exp < (Date.now() / 1000);
          if (!isExpired) {
            const rawRole = payload.role ? payload.role.toLowerCase() : '';
            let mappedRole = null;
            if (rawRole.includes('admin')) mappedRole = 'admin';
            else if (rawRole.includes('vendor') || rawRole.includes('shg')) mappedRole = 'vendor';
            else if (rawRole.includes('consumer')) mappedRole = 'consumer';
            
            if (mappedRole) {
              set({
                token: stored,
                userRole: mappedRole,
                currentRole: mappedRole,
                isLoggedIn: true,
                currentScreen: mappedRole === 'admin' ? 'AdminHome' : (mappedRole === 'vendor' ? 'SHGHome' : 'ConsumerHome')
              });
              return true;
            }
          }
        }
      }
      get().logout();
      return false;
    } catch (e) {
      console.error("Session restoration failed", e);
      get().logout();
      return false;
    }
  },

  // ─── Auth Actions ─────────────────────────────────────────────────────────
  loginUser: (role, credentials, token) => {
    if (token) {
      SecureStore.setItemAsync('naari_jwt_token', token).catch((e) => console.error("SecureStore error", e));
    }
    set((state) => {
      const tokenState = { token: token || state.token, userRole: role };
      if (role === 'consumer') {
        return {
          currentRole: 'consumer',
          isLoggedIn: true,
          ...tokenState,
          user: {
            ...state.user,
            id: credentials.id || state.user.id,
            name: credentials.fullName || state.user.name,
            email: credentials.email || state.user.email,
            phone: credentials.mobileNumber || state.user.phone
          }
        };
      } else if (role === 'vendor') {
        return {
          currentRole: 'vendor',
          isLoggedIn: true,
          ...tokenState,
          vendorProfile: {
            ...state.vendorProfile,
            id: credentials.id || state.vendorProfile.id,
            name: credentials.leaderName || state.vendorProfile.name,
            shgName: credentials.shgName || state.vendorProfile.shgName,
            location: credentials.location || state.vendorProfile.location,
            phone: credentials.phone || state.vendorProfile.phone,
            email: credentials.email || state.vendorProfile.email,
            kycStatus: credentials.kycStatus?.toLowerCase() || 'pending',
            bankLinked: credentials.bankAccountNumber ? true : false,
            aadhaar: credentials.aadhaarNumber || '',
            gstin: credentials.gstNumber || '',
            bankAccountNumber: credentials.bankAccountNumber || '',
            bankIfscCode: credentials.bankIfscCode || '',
            bankName: credentials.bankName || '',
            accountHolderName: credentials.accountHolderName || '',
            upiId: credentials.upiId || '',
          }
        };
      } else if (role === 'admin') {
        return {
          currentRole: 'admin',
          isLoggedIn: true,
          ...tokenState,
          adminProfile: { ...state.adminProfile, email: credentials.email || state.adminProfile.email }
        };
      }
      return { currentRole: role, isLoggedIn: true, ...tokenState };
    });
  // Called from login screens — sets role + updates profile with credentials
  loginUser: (role, credentials) => {
    set((state) => {
      if (role === 'consumer') {
        return {
          currentRole: 'consumer',
          isLoggedIn: true,
          user: { ...state.user, email: credentials.email || state.user.email }
        };
      } else if (role === 'vendor') {
        return {
          currentRole: 'vendor',
          isLoggedIn: true,
          vendorProfile: { ...state.vendorProfile, email: credentials.email || state.vendorProfile.email }
        };
      } else if (role === 'admin') {
        return {
          currentRole: 'admin',
          isLoggedIn: true,
          adminProfile: { ...state.adminProfile, email: credentials.email || state.adminProfile.email }
        };
      }
      return { currentRole: role, isLoggedIn: true };
    });

    // Trigger API fetching asynchronously
    const store = get();
    if (role === 'admin') {
      store.fetchPendingProducts();
      store.fetchProducts();
    } else if (role === 'vendor') {
      store.fetchVendorProducts(get().vendorProfile.id);
    } else if (role === 'consumer') {
      store.fetchProducts();
      store.fetchOrders();
    }
  },

  // Called from registration screens — sets role + creates new profile data
  registerUser: (role, data) => {
    set((state) => {
      if (role === 'consumer') {
        return {
          currentRole: 'consumer',
          isLoggedIn: true,
          user: {
            ...state.user,
            name: data.name || state.user.name,
            email: data.email || state.user.email,
            phone: data.phone || state.user.phone
          }
        };
      } else if (role === 'vendor') {
        return {
          currentRole: 'vendor',
          isLoggedIn: true,
          vendorProfile: {
            ...state.vendorProfile,
            name: data.name || state.vendorProfile.name,
            shgName: data.shgName || state.vendorProfile.shgName,
            email: data.email || state.vendorProfile.email,
            phone: data.phone || state.vendorProfile.phone,
            location: data.location || state.vendorProfile.location,
            kycStatus: 'pending',
            bankLinked: false
          }
        };
      }
      return { currentRole: role, isLoggedIn: true };
    });

    const store = get();
    if (role === 'vendor') {
      store.fetchVendorProducts(get().vendorProfile.id);
    } else if (role === 'consumer') {
      store.fetchProducts();
      store.fetchOrders();
      store.fetchWishlist();
      store.fetchAddresses();
    }
  },

  // Profile Updates
  updateUserProfile: async (updates) => {
    try {
      const token = get().token;
      const payload = {
        fullName: updates.name,
        email: updates.email,
        mobileNumber: updates.phone,
        avatar: updates.avatar
      };
      const res = await authFetch('/api/consumer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, token);

      if (res.ok) {
        const saved = await res.json();
        set((state) => ({
          user: {
            ...state.user,
            name: saved.fullName || state.user.name,
            email: saved.email || state.user.email,
            phone: saved.mobileNumber || state.user.phone,
            avatar: saved.avatar || state.user.avatar
          }
        }));
        return true;
      }
    } catch (e) {
      console.error('Failed to update consumer profile:', e);
    }
    set((state) => ({
      user: { ...state.user, ...updates }
    }));
    return false;
  },

  updateVendorProfile: async (updates) => {
    try {
      const token = get().token;
      const res = await authFetch('/api/shg/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }, token);

      if (res.ok) {
        const saved = await res.json();
        set((state) => ({
          vendorProfile: {
            ...state.vendorProfile,
            id: saved.id,
            name: saved.leaderName,
            shgName: saved.shgName,
            phone: saved.phone,
            email: saved.email,
            location: saved.location,
            category: saved.category,
            members: saved.members,
            bio: saved.bio,
            avatar: saved.avatar,
            bankAccountNumber: saved.bankAccountNumber,
            bankIfscCode: saved.bankIfscCode,
            bankName: saved.bankName,
            accountHolderName: saved.accountHolderName,
            upiId: saved.upiId,
            aadhaar: saved.aadhaarNumber,
            gstin: saved.gstNumber,
            panNumber: saved.panNumber
          }
        }));
        return true;
      }
    } catch (e) {
      console.error('Failed to update vendor profile:', e);
    }
    set((state) => ({
      vendorProfile: { ...state.vendorProfile, ...updates }
    }));
    return false;
  },

  updateAdminProfile: (updates) => set((state) => ({
    adminProfile: { ...state.adminProfile, ...updates }
  })),

  // Admin profile (editable)
  adminProfile: {
    name: 'Devanjan Bose',
    role: 'Founder Sewak / Admin',
    organisation: 'IS&SF',
    phone: '+91 98765 00000',
    email: 'admin@narisamman.in',
    warehouse: 'Sandeshkhali, N24PGS'
  },

  // ─── SHG Management ───────────────────────────────────────────────────────
  shgGroups: [
  { id: 'shg1', name: 'Mamata Biswas', shgName: 'Sundarbans Honey SHG', location: 'Sandeshkhali, N24PGS', phone: '+91 98765 11111', email: 'mamata@shg.in', avatar: '👩‍🌾', products: 12, rating: 4.8, members: 24, kycStatus: 'verified', isActive: true, joinedDate: '2024-01-15', bankLinked: true, totalRevenue: 48000, category: 'food', story: 'Mamata leads a group of 24 women who collect pure Sundarbans honey. After years of selling to middlemen at throwaway prices, Nari Samman gave them direct market access.',
    employees: [
    { id: 'e1a', name: 'Pushpa Das', role: 'Honey Collector', phone: '+91 98001 11001', joinedDate: '2024-02-01' },
    { id: 'e1b', name: 'Rekha Baidya', role: 'Quality Checker', phone: '+91 98001 11002', joinedDate: '2024-02-10' },
    { id: 'e1c', name: 'Saraswati Manna', role: 'Packer', phone: '+91 98001 11003', joinedDate: '2024-03-01' },
    { id: 'e1d', name: 'Bina Halder', role: 'Logistics Handler', phone: '+91 98001 11004', joinedDate: '2024-03-15' }]

  },
  { id: 'shg2', name: 'Rekha Mondal', shgName: 'Tant Weavers Collective', location: 'Nadia, West Bengal', phone: '+91 97650 12345', email: 'rekha@shg.in', avatar: '🧵', products: 18, rating: 4.9, members: 16, kycStatus: 'verified', isActive: true, joinedDate: '2024-02-01', bankLinked: true, totalRevenue: 125000, category: 'textiles', story: "Rekha's family has woven Tant sarees for 4 generations. Nari Samman helped her reach buyers across India without any middleman.",
    employees: [
    { id: 'e2a', name: 'Sulekha Sen', role: 'Master Weaver', phone: '+91 97001 22001', joinedDate: '2024-02-05' },
    { id: 'e2b', name: 'Mina Pal', role: 'Dyer', phone: '+91 97001 22002', joinedDate: '2024-02-15' },
    { id: 'e2c', name: 'Rupa Ghosh', role: 'Finisher', phone: '+91 97001 22003', joinedDate: '2024-03-01' }]

  },
  { id: 'shg3', name: 'Priya Das', shgName: 'Tribal Craft Circle', location: 'Purulia, West Bengal', phone: '+91 94501 23456', email: 'priya@shg.in', avatar: '🏺', products: 9, rating: 4.7, members: 30, kycStatus: 'verified', isActive: true, joinedDate: '2024-03-10', bankLinked: true, totalRevenue: 32000, category: 'crafts', story: 'Priya leads a tribal craft group creating bamboo and clay artifacts that tell stories of their ancient Santhali culture.',
    employees: [
    { id: 'e3a', name: 'Champa Soren', role: 'Bamboo Craftsperson', phone: '+91 94001 33001', joinedDate: '2024-03-20' },
    { id: 'e3b', name: 'Jharna Tudu', role: 'Clay Artist', phone: '+91 94001 33002', joinedDate: '2024-04-01' },
    { id: 'e3c', name: 'Binita Murmu', role: 'Painter', phone: '+91 94001 33003', joinedDate: '2024-04-10' },
    { id: 'e3d', name: 'Sushila Hembram', role: 'Packer', phone: '+91 94001 33004', joinedDate: '2024-04-15' },
    { id: 'e3e', name: 'Tara Besra', role: 'Stock Manager', phone: '+91 94001 33005', joinedDate: '2024-05-01' }]

  },
  { id: 'shg4', name: 'Anita Soren', shgName: 'Jamdani Heritage Weavers', location: 'Murshidabad, West Bengal', phone: '+91 93456 78901', email: 'anita@shg.in', avatar: '🌺', products: 22, rating: 5.0, members: 12, kycStatus: 'verified', isActive: true, joinedDate: '2024-04-05', bankLinked: true, totalRevenue: 210000, category: 'textiles', story: 'Anita is a master Jamdani weaver whose intricate patterns have been recognized at national textile exhibitions.',
    employees: [
    { id: 'e4a', name: 'Kohinoor Begum', role: 'Lead Weaver', phone: '+91 93001 44001', joinedDate: '2024-04-10' },
    { id: 'e4b', name: 'Nasrin Khatun', role: 'Thread Specialist', phone: '+91 93001 44002', joinedDate: '2024-04-20' },
    { id: 'e4c', name: 'Farida Bibi', role: 'Quality Control', phone: '+91 93001 44003', joinedDate: '2024-05-01' }]

  },
  { id: 'shg5', name: 'Lakshmi Roy', shgName: 'Baluchari Revival Group', location: 'Bishnupur, Bankura', phone: '+91 92345 67890', email: 'lakshmi@shg.in', avatar: '🦋', products: 15, rating: 4.8, members: 8, kycStatus: 'pending', isActive: false, joinedDate: '2024-05-12', bankLinked: false, totalRevenue: 0, category: 'textiles', story: 'Lakshmi is reviving the near-extinct Baluchari tradition. Each saree takes 3–6 months to weave and tells Mahabharata stories in silk.',
    employees: [
    { id: 'e5a', name: 'Shyama Karmakar', role: 'Silk Weaver', phone: '+91 92001 55001', joinedDate: '2024-05-20' },
    { id: 'e5b', name: 'Gita Roy', role: 'Design Artist', phone: '+91 92001 55002', joinedDate: '2024-06-01' }]

  },
  { id: 'shg6', name: 'Savitri Mahato', shgName: 'Spice Sisters SHG', location: 'Jhargram, West Bengal', phone: '+91 91234 56789', email: 'savitri@shg.in', avatar: '🌶️', products: 11, rating: 4.6, members: 20, kycStatus: 'pending', isActive: false, joinedDate: '2024-06-20', bankLinked: false, totalRevenue: 0, category: 'food', story: "Savitri's group handgrinds traditional spice blends using recipes passed down for generations. No preservatives, pure tradition.",
    employees: [
    { id: 'e6a', name: 'Durga Mahato', role: 'Spice Grinder', phone: '+91 91001 66001', joinedDate: '2024-07-01' },
    { id: 'e6b', name: 'Kamla Munda', role: 'Packer', phone: '+91 91001 66002', joinedDate: '2024-07-10' },
    { id: 'e6c', name: 'Phulo Oraon', role: 'Quality Checker', phone: '+91 91001 66003', joinedDate: '2024-07-15' }]

  }],

  // ─── SHG Registration Approval Workflow ─────────────────────────────────────
  fetchPendingSHGs: async () => {
    try {
      const token = get().token;
      const res = await authFetch('/api/shg/pending', {}, token);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((shg) => ({
          id: shg.id,
          leaderName: shg.leaderName,
          shgName: shg.shgName,
          email: shg.email,
          phone: shg.phone,
          location: shg.location,
          category: shg.category,
          members: shg.members,
          submittedAt: new Date().toISOString().split('T')[0],
          status: shg.status?.toLowerCase() || 'pending',
          aadhaarNumber: shg.aadhaarNumber,
          panNumber: shg.panNumber,
          gstNumber: shg.gstNumber,
          aadhaarImage: shg.aadhaarImage,
          panImage: shg.panImage,
          gstImage: shg.gstImage,
          accountHolderName: shg.accountHolderName,
          bankAccountNumber: shg.bankAccountNumber,
          bankIfscCode: shg.bankIfscCode,
          bankName: shg.bankName,
          upiId: shg.upiId
        }));
        set({ pendingSHGRegistrations: mapped });
      }
    } catch (e) {
      console.error('Failed to fetch pending SHGs:', e);
    }
  },

  submitSHGRegistration: async (data) => {
    try {
      const res = await publicFetch('/api/shg/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
      }
      const saved = await res.json();
      set((state) => ({
        pendingSHGRegistrations: [
          {
            id: saved.id,
            leaderName: saved.leaderName,
            shgName: saved.shgName,
            email: saved.email,
            phone: saved.phone,
            location: saved.location,
            category: saved.category,
            members: saved.members,
            submittedAt: new Date().toISOString().split('T')[0],
            status: 'pending',
            aadhaarNumber: saved.aadhaarNumber,
            panNumber: saved.panNumber,
            gstNumber: saved.gstNumber,
            aadhaarImage: saved.aadhaarImage,
            panImage: saved.panImage,
            gstImage: saved.gstImage,
            accountHolderName: saved.accountHolderName,
            bankAccountNumber: saved.bankAccountNumber,
            bankIfscCode: saved.bankIfscCode,
            bankName: saved.bankName,
            upiId: saved.upiId
          },
          ...state.pendingSHGRegistrations
        ],
        adminStats: {
          ...state.adminStats,
          pendingApprovals: state.adminStats.pendingApprovals + 1
        }
      }));
      return saved;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  // Admin approves a pending SHG registration → adds them to shgGroups as active
  approveSHGRegistration: async (regId) => {
    try {
      const token = get().token;
      const res = await authFetch(`/api/shg/${regId}/approve`, {
        method: 'PUT'
      }, token);
      if (res.ok) {
        const payload = await res.json();
        const reg = payload.shg;
        if (!reg) return;

        const catMap = {
          'Food & Agriculture': 'food',
          'Textiles & Weaving': 'textiles',
          'Crafts & Handicrafts': 'crafts',
          'Herbal & Wellness': 'food',
          'Other': 'crafts'
        };
        const emojiMap = { food: '🌿', textiles: '🧵', crafts: '🏺' };
        const cat = catMap[reg.category] || 'crafts';

        const newSHG = {
          id: reg.id,
          name: reg.leaderName,
          shgName: reg.shgName,
          location: reg.location,
          phone: reg.phone,
          email: reg.email,
          avatar: emojiMap[cat] || '👩‍🌾',
          products: 0,
          rating: 0,
          members: reg.members,
          kycStatus: 'verified',
          isActive: true,
          joinedDate: new Date().toISOString().split('T')[0],
          bankLinked: true,
          totalRevenue: 0,
          category: cat,
          story: `${reg.leaderName} leads ${reg.shgName}, recently onboarded to Nari Samman.`,
          aadhaar: reg.aadhaarNumber,
          gstin: reg.gstNumber,
          bankAccountNumber: reg.bankAccountNumber,
          bankIfscCode: reg.bankIfscCode,
          bankName: reg.bankName,
          accountHolderName: reg.accountHolderName,
          upiId: reg.upiId,
          employees: []
        };

        set((state) => ({
          pendingSHGRegistrations: state.pendingSHGRegistrations.map((r) =>
            r.id === regId ? { ...r, status: 'approved' } : r
          ),
          shgGroups: [newSHG, ...state.shgGroups],
          adminStats: {
            ...state.adminStats,
            activeSHGs: state.adminStats.activeSHGs + 1,
            pendingApprovals: Math.max(0, state.adminStats.pendingApprovals - 1)
          }
        }));
      }
    } catch (e) {
      console.error('Approve failed:', e);
    }
  },

  // Admin rejects a pending SHG registration
  rejectSHGRegistration: async (regId, reason) => {
    try {
      const token = get().token;
      const res = await authFetch(`/api/shg/${regId}/reject`, {
        method: 'PUT'
      }, token);
      if (res.ok) {
        set((state) => ({
          pendingSHGRegistrations: state.pendingSHGRegistrations.map((r) =>
            r.id === regId ? { ...r, status: 'rejected', rejectionReason: reason || 'Rejected by admin' } : r
          ),
          adminStats: {
            ...state.adminStats,
            pendingApprovals: Math.max(0, state.adminStats.pendingApprovals - 1)
          }
        }));
      }
    } catch (e) {
      console.error('Reject failed:', e);
    }
  },

  toggleSHGStatus: (shgId) => set((state) => ({
    shgGroups: state.shgGroups.map((s) => s.id === shgId ? { ...s, isActive: !s.isActive } : s)
  })),
  updateSHGKYC: (shgId, status) => set((state) => ({
    shgGroups: state.shgGroups.map((s) => s.id === shgId ? { ...s, kycStatus: status } : s)
  })),

  // ─── Warehouse / Logistics ─────────────────────────────────────────────────
  warehouseStock: [
  { id: 'ws1', productName: 'Sundarbans Forest Honey', shgName: 'Sundarbans Honey SHG', category: 'food', qty: 45, unit: '500g jars', qualityStatus: 'approved', receivedDate: '2025-05-08', location: 'Rack A-3' },
  { id: 'ws2', productName: 'Tant Saree – Crimson Border', shgName: 'Tant Weavers Collective', category: 'textiles', qty: 22, unit: 'pieces', qualityStatus: 'approved', receivedDate: '2025-05-07', location: 'Rack B-1' },
  { id: 'ws3', productName: 'Palm Jaggery', shgName: 'Spice Sisters SHG', category: 'food', qty: 60, unit: '1kg packs', qualityStatus: 'quality_check', receivedDate: '2025-05-10', location: 'Dock Area' },
  { id: 'ws4', productName: 'Bamboo Fruit Basket', shgName: 'Tribal Craft Circle', category: 'crafts', qty: 50, unit: 'pieces', qualityStatus: 'approved', receivedDate: '2025-05-06', location: 'Rack C-2' },
  { id: 'ws5', productName: 'Jamdani Saree – White & Gold', shgName: 'Jamdani Heritage Weavers', category: 'textiles', qty: 8, unit: 'pieces', qualityStatus: 'approved', receivedDate: '2025-05-09', location: 'Rack B-3' },
  { id: 'ws6', productName: 'Organic Turmeric Powder', shgName: 'Spice Sisters SHG', category: 'food', qty: 150, unit: '200g packs', qualityStatus: 'rejected', receivedDate: '2025-05-11', location: 'Rejected Bin', rejectionReason: 'Failed moisture content test' }],

  updateWarehouseItemStatus: (id, status, reason) => set((state) => ({
    warehouseStock: state.warehouseStock.map((w) => w.id === id ? { ...w, qualityStatus: status, rejectionReason: reason || w.rejectionReason } : w)
  })),

  dispatches: [
  { id: 'd1', orderId: 'ord001', consumerOrderId: 'ord001', productNames: ['Sundarbans Honey x2', 'Tant Saree x1'], destination: 'Mumbai, Maharashtra', buyer: 'Aarav Sharma', vehicle: 'WB-23 CD 5678', driver: 'Ramesh Kumar', status: 'delivered', dispatchDate: '2025-05-09', eta: 'Delivered May 10' },
  { id: 'd2', orderId: 'ord002', consumerOrderId: 'ord002', productNames: ['Palm Jaggery x3'], destination: 'Delhi, NCR', buyer: 'Meera Patel', vehicle: 'WB-01 AB 1234', driver: 'Anuj Sharma', status: 'in_transit', dispatchDate: '2025-05-06', eta: 'Today 6 PM' },
  { id: 'd3', orderId: 'ord003', consumerOrderId: 'ord003', productNames: ['Baluchari Silk x1'], destination: 'Bangalore, Karnataka', buyer: 'Rekha Nair', vehicle: 'KA-01 EF 9012', driver: 'Suresh Nair', status: 'at_hub', dispatchDate: null, eta: 'May 14' },
  { id: 'd4', orderId: 'ord004', productNames: ['Bamboo Basket x4'], destination: 'Kolkata, WB', buyer: 'Bimal Das', vehicle: 'WB-01 GH 3456', driver: 'Bimal Das', status: 'delivered', dispatchDate: '2025-05-08', eta: 'Delivered May 10' }],

  updateDispatchStatus: (id, status) => set((state) => {
    const dispatch = state.dispatches.find((d) => d.id === id);
    if (!dispatch) return {};

    const flow = DISPATCH_TO_ORDER[status] || DISPATCH_TO_ORDER.at_hub;
    const relatedVendorOrders = getRelatedVendorOrders(state, dispatch);
    const relatedVendorIds = relatedVendorOrders.map((o) => o.id);
    const relatedConsumerOrder = getRelatedConsumerOrder(state, dispatch, relatedVendorOrders[0]);
    const consumerOrderId = relatedConsumerOrder?.id || dispatch.consumerOrderId || (String(dispatch.orderId).startsWith('ord') ? dispatch.orderId : null);
    const vendorOrderId = relatedVendorIds[0] || dispatch.vendorOrderId || (String(dispatch.orderId).startsWith('vo') ? dispatch.orderId : null);

    const updatedDispatches = state.dispatches.map((d) => {
      if (d.id !== id) return d;
      return {
        ...d,
        status,
        consumerOrderId: consumerOrderId || d.consumerOrderId,
        vendorOrderId: vendorOrderId || d.vendorOrderId,
        dispatchDate: ['dispatched', 'in_transit', 'delivered'].includes(status) && !d.dispatchDate ? todayDate() : d.dispatchDate,
        eta: status === 'delivered' ? `Delivered ${todayDate()}` : status === 'in_transit' ? 'On the way' : status === 'dispatched' ? 'In transit soon' : d.eta
      };
    });

    const updatedVendorOrders = state.vendorOrders.map((o) => {
      const linked = relatedVendorIds.includes(o.id) || (consumerOrderId && o.consumerOrderId === consumerOrderId);
      if (!linked) return o;
      return {
        ...o,
        status: flow.vendorStatus,
        tracking: flow.tracking,
        logisticsStatus: status,
        paymentStatus: status === 'delivered' ? 'pending_payment' : o.paymentStatus,
        trackingTimeline: appendTrackingEvent(o.trackingTimeline, flow.vendorStatus, flow.title, flow.tracking, 'Logistics')
      };
    });

    const updatedOrders = state.orders.map((o) => {
      if (o.id !== consumerOrderId) return o;
      return {
        ...o,
        status: flow.consumerStatus,
        tracking: flow.tracking,
        logisticsStatus: status,
        paymentStatus: status === 'delivered' ? 'paid' : o.paymentStatus,
        trackingTimeline: appendTrackingEvent(o.trackingTimeline, flow.consumerStatus, flow.title, flow.tracking, 'Logistics')
      };
    });

    const consumerNotif = consumerOrderId ? {
      id: `n_${Date.now()}`,
      type: 'order',
      message: `🚚 Order #${consumerOrderId}: ${flow.tracking}`,
      time: 'Just now',
      read: false
    } : null;

    const vendorNotif = relatedVendorIds.length > 0 ? {
      id: `vn_${Date.now()}`,
      type: 'order',
      message: `🚚 Logistics updated ${relatedVendorOrders[0]?.item || 'your order'} to ${flow.title}.`,
      time: 'Just now',
      read: false
    } : null;

    return {
      dispatches: updatedDispatches,
      vendorOrders: updatedVendorOrders,
      orders: updatedOrders,
      notifications: consumerNotif ? [consumerNotif, ...state.notifications] : state.notifications,
      vendorNotifications: vendorNotif ? [vendorNotif, ...state.vendorNotifications] : state.vendorNotifications
    };
  }),

  // Cart
  addToCart: (product, qty = 1) => set((state) => {
    const existing = state.cart.find((i) => i.id === product.id);
    if (existing) {
      return { cart: state.cart.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i) };
    }
    return { cart: [...state.cart, { ...product, qty }] };
  }),
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter((i) => i.id !== productId) })),
  updateCartQty: (productId, qty) => set((state) => ({
    cart: qty <= 0 ?
    state.cart.filter((i) => i.id !== productId) :
    state.cart.map((i) => i.id === productId ? { ...i, qty } : i)
  })),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  },
  getCartCount: () => get().cart.reduce((sum, i) => sum + i.qty, 0),

  // Wishlist — synced with real backend
  fetchWishlist: async () => {
    try {
      const userId = get().user.id;
      const response = await fetch(`${API_BASE}/wishlist?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        set({ wishlist: data });
      }
    } catch (error) {
      console.warn('Backend offline, could not fetch wishlist:', error);
    }
  },

  toggleWishlist: async (product) => {
    const state = get();
    const userId = state.user.id;
    // Use numeric db id if available (from backend product), else use string id
    const productId = product.id;
    const exists = state.wishlist.find((i) => String(i.id) === String(productId));

    if (exists) {
      // Optimistically remove
      set((s) => ({ wishlist: s.wishlist.filter((i) => String(i.id) !== String(productId)) }));
      try {
        await fetch(`${API_BASE}/wishlist?userId=${userId}&productId=${productId}`, { method: 'DELETE' });
      } catch (error) {
        // Rollback on failure
        set((s) => ({ wishlist: [...s.wishlist, product] }));
        console.warn('Failed to remove from wishlist:', error);
      }
    } else {
      // Optimistically add
      set((s) => ({ wishlist: [...s.wishlist, product] }));
      try {
        await fetch(`${API_BASE}/wishlist?userId=${userId}&productId=${productId}`, { method: 'POST' });
      } catch (error) {
        // Rollback on failure
        set((s) => ({ wishlist: s.wishlist.filter((i) => String(i.id) !== String(productId)) }));
        console.warn('Failed to add to wishlist:', error);
      }
    }
  },
  isWishlisted: (productId) => get().wishlist.some((i) => String(i.id) === String(productId)),

  // Address Book — synced with real backend
  fetchAddresses: async () => {
    try {
      const userId = get().user.id;
      const response = await fetch(`${API_BASE}/addresses?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        set((state) => ({ user: { ...state.user, addresses: data } }));
      }
    } catch (error) {
      console.warn('Backend offline, could not fetch addresses:', error);
    }
  },

  addAddress: async (address) => {
    try {
      const userId = get().user.id;
      const payload = { ...address, userId };
      const response = await fetch(`${API_BASE}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        await get().fetchAddresses(); // Refresh from backend
      }
    } catch (error) {
      console.warn('Failed to add address:', error);
    }
  },

  updateAddress: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        await get().fetchAddresses();
      }
    } catch (error) {
      console.warn('Failed to update address:', error);
    }
  },

  deleteAddress: async (id) => {
    // Optimistically remove
    set((state) => ({
      user: { ...state.user, addresses: state.user.addresses.filter((a) => a.id !== id) }
    }));
    try {
      await fetch(`${API_BASE}/addresses/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.warn('Failed to delete address:', error);
      await get().fetchAddresses(); // Re-sync on error
    }
  },

  // Search & Filter
  setSearch: (query) => set({ searchQuery: query }),
  setCategory: (cat) => set({ selectedCategory: cat }),
  getFilteredProducts: () => {
    const { products, searchQuery, selectedCategory } = get();
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags?.some((t) => t.includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  },

  // ─── ORDERS: Real-world workflow ──────────────────────────────────────────
  // Consumer places order → status = 'confirmed', paymentStatus = 'pending' (COD / pay on delivery)
  // Vendor updates: confirmed → packed → shipped → delivered
  // On 'delivered': paymentStatus on consumer order → 'paid', vendor order → 'pending_payment'
  //   (consumer pays cash on delivery; platform marks as received)
  // Vendor requests payout → admin sees request → admin pays → vendor gets notified → shows in earnings
  fetchOrders: async () => {
    try {
      const response = await fetch(`${API_BASE}/orders?userId=${get().user.id}`);
      if (response.ok) {
        const data = await response.json();
        set({ orders: data });
      }
    } catch (error) {
      console.warn('Backend offline, could not fetch orders:', error);
    }
  },

  placeOrder: async (address) => {
    const state = get();
    const orderId = `ord${Date.now()}`;
    const orderDate = new Date().toISOString().split('T')[0];
    const orderTotal = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    // Consumer order — starts as confirmed, payment pending (COD model)
    const newOrder = {
      orderId: orderId,
      date: orderDate,
      status: 'confirmed',
      paymentStatus: 'pending',
      items: state.cart.map((i) => ({
        productId: i.id, qty: i.qty, name: i.name,
        price: i.price, unit: i.unit, image: i.image, emoji: i.emoji
      })),
      total: orderTotal,
      address,
      tracking: ORDER_TRACKING_MESSAGES.confirmed,
      userId: state.user.id
    };

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (response.ok) {
        set({ cart: [] });
        await get().fetchOrders();
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }

    // Mirror as vendor order(s) — vendor sees it as 'confirmed'
    const newVendorOrders = state.cart.map((i, idx) => ({
      id: `vo_${orderId}_${idx}`,
      buyer: state.user.name,
      item: i.name,
      qty: i.qty,
      amount: i.price * i.qty,
      status: 'confirmed',
      paymentStatus: 'pending',
      date: orderDate,
      consumerOrderId: orderId,
      productId: i.id,
      image: i.image,
      tracking: ORDER_TRACKING_MESSAGES.confirmed,
      trackingTimeline: [makeTrackingEvent('confirmed', 'Order Confirmed', ORDER_TRACKING_MESSAGES.confirmed, 'System')]
    }));

    set((s) => ({
      vendorOrders: [...newVendorOrders, ...s.vendorOrders],
      adminStats: {
        ...s.adminStats,
        totalRevenue: s.adminStats.totalRevenue + orderTotal
      }
    }));
  },

  // Vendor updates order status — syncs back to consumer order
  // Workflow before logistics: confirmed → packed. Logistics owns shipped → delivered.
  updateOrderStatus: (vendorOrderId, newStatus) => set((state) => {
    const vendorOrder = state.vendorOrders.find((o) => o.id === vendorOrderId);
    if (!vendorOrder) return {};

    const tracking = ORDER_TRACKING_MESSAGES[newStatus] || vendorOrder.tracking || ORDER_TRACKING_MESSAGES.confirmed;
    const title = newStatus === 'packed' ? 'Packed by SHG' : 'Order Updated';

    const updatedVendorOrders = state.vendorOrders.map((o) =>
      o.id === vendorOrderId
        ? {
            ...o,
            status: newStatus,
            tracking,
            paymentStatus: newStatus === 'delivered' ? 'pending_payment' : o.paymentStatus,
            trackingTimeline: appendTrackingEvent(o.trackingTimeline, newStatus, title, tracking, 'Vendor')
          }
        : o
    );

    let updatedOrders = state.orders;
    if (vendorOrder.consumerOrderId) {
      updatedOrders = state.orders.map((o) => {
        if (o.id !== vendorOrder.consumerOrderId) return o;
        return {
          ...o,
          status: newStatus,
          tracking,
          paymentStatus: newStatus === 'delivered' ? 'paid' : o.paymentStatus,
          trackingTimeline: appendTrackingEvent(o.trackingTimeline, newStatus, title, tracking, 'Vendor')
        };
      });
    }

    const notifMessages = {
      packed: '📦 Your order is packed and ready for logistics!',
      delivered: '🎉 Your order has been delivered! Thank you.'
    };
    const newNotif = notifMessages[newStatus] && vendorOrder.consumerOrderId ? {
      id: `n_${Date.now()}`,
      type: 'order',
      message: notifMessages[newStatus],
      time: 'Just now',
      read: false
    } : null;

    return {
      vendorOrders: updatedVendorOrders,
      orders: updatedOrders,
      notifications: newNotif ? [newNotif, ...state.notifications] : state.notifications
    };
  }),

  // SHG sends a packed order to logistics (SHG → Logistics → Customer)
  shgSendToLogistics: (vendorOrderId) => set((state) => {
    const order = state.vendorOrders.find((o) => o.id === vendorOrderId);
    if (!order) return {};

    const existingDispatch = state.dispatches.find((d) => d.vendorOrderId === vendorOrderId || d.orderId === vendorOrderId);
    const consumerOrder = order.consumerOrderId ? state.orders.find((o) => o.id === order.consumerOrderId) : null;
    const tracking = ORDER_TRACKING_MESSAGES.sent_to_logistics;

    const updatedVendorOrders = state.vendorOrders.map((o) =>
      o.id === vendorOrderId
        ? {
            ...o,
            status: 'sent_to_logistics',
            logisticsStatus: 'at_hub',
            tracking,
            sentToLogisticsAt: todayDate(),
            trackingTimeline: appendTrackingEvent(o.trackingTimeline, 'sent_to_logistics', 'Handed to Logistics', tracking, 'Vendor')
          }
        : o
    );

    const updatedOrders = consumerOrder
      ? state.orders.map((o) =>
          o.id === consumerOrder.id
            ? {
                ...o,
                status: 'packed',
                logisticsStatus: 'at_hub',
                tracking,
                trackingTimeline: appendTrackingEvent(o.trackingTimeline, 'sent_to_logistics', 'Handed to Logistics', tracking, 'Vendor')
              }
            : o
        )
      : state.orders;

    const dispatchPayload = existingDispatch ? null : {
      id: `d_${vendorOrderId}_${Date.now()}`,
      orderId: order.consumerOrderId || vendorOrderId,
      vendorOrderId,
      consumerOrderId: order.consumerOrderId || null,
      shgName: order.shgName || state.vendorProfile.shgName || 'SHG',
      productNames: [`${order.item} x${order.qty}`],
      destination: consumerOrder?.address || 'Pending address confirmation',
      buyer: order.buyer,
      vehicle: null,
      driver: null,
      status: 'at_hub',
      dispatchDate: null,
      eta: 'Assigning delivery partner',
      trackingTimeline: [makeTrackingEvent('at_hub', 'At Logistics Hub', tracking, 'Vendor')]
    };

    const updatedDispatches = existingDispatch
      ? state.dispatches.map((d) =>
          d.id === existingDispatch.id
            ? { ...d, status: 'at_hub', vendorOrderId, consumerOrderId: order.consumerOrderId || d.consumerOrderId, eta: 'Assigning delivery partner' }
            : d
        )
      : [dispatchPayload, ...state.dispatches];

    const logisticsNotif = {
      id: `n_${Date.now()}`,
      type: 'order',
      message: `📦 Order #${order.consumerOrderId || order.id} has reached logistics hub.`,
      time: 'Just now',
      read: false
    };

    return {
      vendorOrders: updatedVendorOrders,
      orders: updatedOrders,
      dispatches: updatedDispatches,
      notifications: [logisticsNotif, ...state.notifications]
    };
  }),
  // 1. Vendor requests payout for delivered orders with pending_payment status
  // 2. Admin sees payout requests, approves and marks as paid
  // 3. Vendor gets notified, amount moves from pending_payment → paid in earnings

  // Vendor: request payout for specific delivered orders
  requestPayout: (orderIds) => set((state) => {
    const eligibleOrders = state.vendorOrders.filter((o) =>
    orderIds.includes(o.id) && o.status === 'delivered' && o.paymentStatus === 'pending_payment'
    );
    if (eligibleOrders.length === 0) return {};

    const totalAmount = eligibleOrders.reduce((s, o) => s + o.amount, 0);
    const newRequest = {
      id: `pr_${Date.now()}`,
      vendorId: state.vendorProfile.id,
      vendorName: state.vendorProfile.name,
      amount: totalAmount,
      status: 'requested',
      requestedAt: new Date().toISOString().split('T')[0],
      paidAt: null,
      ref: null,
      orders: orderIds
    };

    // Mark those vendor orders as payout_requested
    const updatedVendorOrders = state.vendorOrders.map((o) =>
    orderIds.includes(o.id) ? { ...o, paymentStatus: 'payout_requested' } : o
    );

    return {
      payoutRequests: [newRequest, ...state.payoutRequests],
      vendorOrders: updatedVendorOrders
    };
  }),

  // Admin: approve and pay a payout request
  approvePayoutRequest: (requestId) => set((state) => {
    const request = state.payoutRequests.find((r) => r.id === requestId);
    if (!request || request.status !== 'requested') return {};

    const refCode = `NS-PAY-${Date.now().toString().slice(-4)}`;

    // Mark payout request as paid
    const updatedRequests = state.payoutRequests.map((r) =>
    r.id === requestId ?
    { ...r, status: 'paid', paidAt: new Date().toISOString().split('T')[0], ref: refCode } :
    r
    );

    // Mark vendor orders as paid
    const updatedVendorOrders = state.vendorOrders.map((o) =>
    request.orders.includes(o.id) ? { ...o, paymentStatus: 'paid' } : o
    );

    // Update admin revenue — add payout as confirmed revenue
    const updatedAdminStats = {
      ...state.adminStats
    };

    // Notify vendor
    const vendorNotif = {
      id: `vn_${Date.now()}`,
      type: 'payment',
      message: `💰 Payment of ₹${request.amount.toLocaleString()} credited to your bank account! Ref: ${refCode}`,
      time: 'Just now',
      read: false,
      amount: request.amount,
      ref: refCode
    };

    return {
      payoutRequests: updatedRequests,
      vendorOrders: updatedVendorOrders,
      adminStats: updatedAdminStats,
      vendorNotifications: [vendorNotif, ...state.vendorNotifications]
    };
  }),

  // Admin: reject a payout request
  rejectPayoutRequest: (requestId, reason) => set((state) => {
    const request = state.payoutRequests.find((r) => r.id === requestId);
    if (!request) return {};

    const updatedRequests = state.payoutRequests.map((r) =>
    r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason || 'Request rejected by admin' } : r
    );

    // Revert vendor orders back to pending_payment
    const updatedVendorOrders = state.vendorOrders.map((o) =>
    request.orders.includes(o.id) ? { ...o, paymentStatus: 'pending_payment' } : o
    );

    const vendorNotif = {
      id: `vn_${Date.now()}`,
      type: 'payment_rejected',
      message: `⚠️ Payout request of ₹${request.amount.toLocaleString()} was not processed. ${reason || 'Please contact admin.'}`,
      time: 'Just now',
      read: false
    };

    return {
      payoutRequests: updatedRequests,
      vendorOrders: updatedVendorOrders,
      vendorNotifications: [vendorNotif, ...state.vendorNotifications]
    };
  }),

  markVendorNotifRead: (id) => set((state) => ({
    vendorNotifications: state.vendorNotifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),

  // ─── Product Management ────────────────────────────────────────────────────
  // Backend API Sync Actions
  fetchProducts: async () => {
    try {
      const response = await fetch(`${API_BASE}/products?status=APPROVED`);
      if (response.ok) {
        const data = await response.json();
        set({ products: data });
      }
    } catch (error) {
      console.warn('Backend offline, using local mock data for approved products:', error);
      set({ products: [] });
    }
  },

  fetchPendingProducts: async () => {
    try {
      const response = await fetch(`${API_BASE}/products?status=PENDING`);
      if (response.ok) {
        const data = await response.json();
        set((state) => ({
          pendingProducts: data,
          adminStats: {
            ...state.adminStats,
            pendingApprovals: data.length
          }
        }));
      }
    } catch (error) {
      console.warn('Backend offline, using local mock data for pending products:', error);
    }
  },

  fetchVendorProducts: async (artisanId) => {
    try {
      const response = await fetch(`${API_BASE}/products?artisanId=${artisanId}`);
      if (response.ok) {
        const data = await response.json();
        set({ vendorProducts: data });
      }
    } catch (error) {
      console.warn('Backend offline, using local mock data for vendor products:', error);
    }
  },

  addProductToPending: async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          mrp: Number(formData.mrp) || Number(formData.price),
          unit: formData.unit,
          description: formData.description,
          stock: Number(formData.stock) || 10,
          tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          emoji: formData.category === 'food' ? '🍯' : formData.category === 'textiles' ? '🧵' : '🏺',
          image: formData.image || null,
          artisanId: get().vendorProfile.id,
          certifications: formData.certifications || {}
        })
      });
      if (response.ok) {
        await get().fetchPendingProducts();
        await get().fetchVendorProducts(get().vendorProfile.id);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      // Fallback
      set((state) => {
        const newProduct = {
          id: `pending_${Date.now()}`,
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          mrp: Number(formData.mrp) || Number(formData.price),
          unit: formData.unit,
          description: formData.description,
          stock: Number(formData.stock) || 10,
          tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          emoji: formData.category === 'food' ? '🍯' : formData.category === 'textiles' ? '🧵' : '🏺',
          image: formData.image || null,
          rating: 0,
          reviews: 0,
          artisanId: state.vendorProfile.id,
          status: 'pending',
          badge: null
        };
        return {
          pendingProducts: [newProduct, ...state.pendingProducts],
          vendorProducts: [newProduct, ...state.vendorProducts],
          adminStats: {
            ...state.adminStats,
            pendingApprovals: state.adminStats.pendingApprovals + 1
          }
        };
      });
    }
  },

  removeVendorProduct: async (productId) => {
    try {
      if (String(productId).startsWith('pending_')) {
        set((state) => ({
          pendingProducts: state.pendingProducts.filter((p) => p.id !== productId)
        }));
        return;
      }
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await get().fetchVendorProducts(get().vendorProfile.id);
        await get().fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      set((state) => ({
        vendorProducts: state.vendorProducts.filter((p) => p.id !== productId)
      }));
    }
  },

  updateVendorProduct: async (productId, formData) => {
    try {
      if (String(productId).startsWith('pending_')) {
        set((state) => {
          const currentProduct = state.vendorProducts.find((p) => p.id === productId);
          if (!currentProduct) return {};
          const updatedProduct = {
            ...currentProduct,
            name: formData.name,
            category: formData.category,
            price: Number(formData.price) || currentProduct.price,
            mrp: Number(formData.mrp) || Number(formData.price) || currentProduct.mrp,
            unit: formData.unit,
            description: formData.description,
            stock: Number(formData.stock) || currentProduct.stock,
            tags: formData.tags ? formData.tags.split(',') : [],
            image: formData.image || currentProduct.image || null,
          };
          return {
            vendorProducts: state.vendorProducts.map((p) => (p.id === productId ? updatedProduct : p))
          };
        });
        return;
      }

      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          mrp: Number(formData.mrp) || Number(formData.price),
          unit: formData.unit,
          description: formData.description,
          stock: Number(formData.stock),
          tags: Array.isArray(formData.tags)
            ? formData.tags
            : formData.tags
              ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
              : [],
          image: formData.image || null,
          certifications: formData.certifications || {}
        })
      });
      if (response.ok) {
        await get().fetchVendorProducts(get().vendorProfile.id);
        await get().fetchProducts();
        await get().fetchPendingProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  },

  approveProduct: async (productId) => {
    try {
      if (String(productId).startsWith('pending_')) {
        set((state) => {
          const product = state.pendingProducts.find((p) => p.id === productId);
          if (!product) return {};
          const { status, ...liveProduct } = product;
          return {
            pendingProducts: state.pendingProducts.filter((p) => p.id !== productId),
            products: [liveProduct, ...state.products],
            vendorProducts: [liveProduct, ...state.vendorProducts],
            adminStats: { ...state.adminStats, productsListed: state.adminStats.productsListed + 1, pendingApprovals: Math.max(0, state.adminStats.pendingApprovals - 1) }
          };
        });
        return;
      }

      const response = await fetch(`${API_BASE}/products/${productId}/approve`, {
        method: 'PUT'
      });
      if (response.ok) {
        await get().fetchPendingProducts();
        await get().fetchProducts();
        if (get().vendorProfile && get().vendorProfile.id) {
          await get().fetchVendorProducts(get().vendorProfile.id);
        }
      }
    } catch (error) {
      console.error('Error approving product:', error);
      // Fallback
      set((state) => {
        const product = state.pendingProducts.find((p) => p.id === productId);
        if (!product) return {};
        const updatedProduct = { ...product, status: 'APPROVED' };
        return {
          pendingProducts: state.pendingProducts.filter((p) => p.id !== productId),
          products: [updatedProduct, ...state.products],
          vendorProducts: state.vendorProducts.map((p) => p.id === productId ? updatedProduct : p),
          adminStats: { ...state.adminStats, productsListed: state.adminStats.productsListed + 1, pendingApprovals: Math.max(0, state.adminStats.pendingApprovals - 1) }
        };
      });
    }
  },

  rejectProduct: async (productId) => {
    try {
      if (String(productId).startsWith('pending_')) {
        set((state) => ({
          pendingProducts: state.pendingProducts.filter((p) => p.id !== productId),
          vendorProducts: state.vendorProducts.map((p) => p.id === productId ? { ...p, status: 'REJECTED' } : p),
          adminStats: { ...state.adminStats, pendingApprovals: Math.max(0, state.adminStats.pendingApprovals - 1) }
        }));
        return;
      }

      const response = await fetch(`${API_BASE}/products/${productId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Rejected by admin' })
      });
      if (response.ok) {
        await get().fetchPendingProducts();
        await get().fetchProducts();
        if (get().vendorProfile && get().vendorProfile.id) {
          await get().fetchVendorProducts(get().vendorProfile.id);
        }
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      // Fallback
      set((state) => ({
        pendingProducts: state.pendingProducts.filter((p) => p.id !== productId),
        vendorProducts: state.vendorProducts.map((p) => p.id === productId ? { ...p, status: 'REJECTED' } : p),
        adminStats: { ...state.adminStats, pendingApprovals: Math.max(0, state.adminStats.pendingApprovals - 1) }
      }));
    }
  },

  // Notifications
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  getUnreadCount: () => get().notifications.filter((n) => !n.read).length
}));

export default useStore;