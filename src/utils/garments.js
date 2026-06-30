export const CATEGORIES = [
  {
    id: 'tshirt',
    name: 'T-Shirts',
    description: 'Classic cotton tees for everyday comfort',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    icon: '👕',
    availableColors: ['#ffffff', '#000000', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    availableTextures: ['cotton', 'pattern', 'stripes', 'floral'],
    availableMaterials: ['cotton', 'linen'],
  },
  {
    id: 'shirt',
    name: 'Shirts',
    description: 'Formal and casual shirts for any occasion',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
    icon: '👔',
    availableColors: ['#ffffff', '#000000', '#3b82f6', '#6b7280', '#f59e0b', '#10b981', '#8b5cf6'],
    availableTextures: ['cotton', 'linen', 'checks', 'stripes'],
    availableMaterials: ['cotton', 'linen', 'denim'],
  },
  {
    id: 'hoodie',
    name: 'Hoodies',
    description: 'Warm and stylish hooded sweatshirts',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-violet-600',
    icon: '🧥',
    availableColors: ['#ffffff', '#000000', '#6b7280', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'],
    availableTextures: ['cotton', 'pattern', 'stripes'],
    availableMaterials: ['cotton', 'denim', 'leather'],
  },
  {
    id: 'pants',
    name: 'Pants',
    description: 'Jeans, trousers, and everything in between',
    color: '#10b981',
    gradient: 'from-emerald-500 to-green-600',
    icon: '👖',
    availableColors: ['#000000', '#1e3a5f', '#6b7280', '#ffffff', '#8b4513', '#2d2d2d'],
    availableTextures: ['denim', 'cotton', 'linen'],
    availableMaterials: ['denim', 'cotton', 'linen'],
  },
  {
    id: 'cap',
    name: 'Accessories',
    description: 'Caps, bags, and more to complete your look',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-yellow-600',
    icon: '🧢',
    availableColors: ['#000000', '#ffffff', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
    availableTextures: ['cotton', 'denim', 'leather', 'pattern'],
    availableMaterials: ['cotton', 'leather', 'denim'],
  },
]

export const ALL_COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#000000' },
  { name: 'Gray', hex: '#6b7280' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Yellow', hex: '#f59e0b' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Brown', hex: '#8b4513' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Orange', hex: '#f97316' },
]

export const TEXTURES = [
  { id: 'cotton', name: 'Cotton', category: 'fabric' },
  { id: 'denim', name: 'Denim', category: 'fabric' },
  { id: 'leather', name: 'Leather', category: 'fabric' },
  { id: 'linen', name: 'Linen', category: 'fabric' },
  { id: 'pattern', name: 'Pattern', category: 'pattern' },
  { id: 'floral', name: 'Floral', category: 'pattern' },
  { id: 'stripes', name: 'Stripes', category: 'pattern' },
  { id: 'checks', name: 'Checks', category: 'pattern' },
]

export const MATERIAL_OPTIONS = [
  { key: 'roughness', name: 'Roughness', min: 0, max: 1, step: 0.01 },
  { key: 'metalness', name: 'Shine', min: 0, max: 1, step: 0.01 },
  { key: 'fabricShine', name: 'Fabric Gloss', min: 0, max: 1, step: 0.01 },
]

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id)
}

export const PRODUCT_INFO = {
  tshirt: {
    name: 'Classic Cotton Tee',
    description: 'Premium cotton t-shirt with a relaxed fit. Features a ribbed crew neck and reinforced seams for lasting comfort.',
    price: '$29.99',
  },
  shirt: {
    name: 'Signature Button-Down',
    description: 'Tailored fit button-down shirt crafted from breathable fabric. Features a spread collar and adjustable cuffs.',
    price: '$59.99',
  },
  hoodie: {
    name: 'Essential Pullover Hoodie',
    description: 'Heavyweight fleece hoodie with a kangaroo pocket and adjustable drawstring hood. Brushed interior for extra warmth.',
    price: '$79.99',
  },
  pants: {
    name: 'Slim Fit Chinos',
    description: 'Modern slim fit chino pants with a mid-rise waist. Crafted from stretch cotton twill for all-day comfort.',
    price: '$69.99',
  },
  cap: {
    name: 'Structured Baseball Cap',
    description: 'Classic six-panel cap with a pre-curved brim and adjustable snapback closure. Embroidered eyelets for breathability.',
    price: '$24.99',
  },
}
