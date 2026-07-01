import { create } from 'zustand'
import { FLOORS, getSectionCategories, findLocationForCategory } from '../utils/garments'

const FIRST_FLOOR = FLOORS[0]
const FIRST_SECTION = FIRST_FLOOR.sections[0]

const useStore = create((set, get) => ({
  // ── Navigation ──────────────────────────────────────
  page: 'splash',
  splashDone: false,

  // ── Onboarding (Scene 2) ─────────────────────────────
  onboardingDone: false,
  motionPreference: 'cinematic',
  inputDevice: 'mouse',
  soundEnabled: false,

  // ── Showroom location ────────────────────────────────
  currentFloorId: FIRST_FLOOR.id,
  currentSectionId: FIRST_SECTION.id,
  hoveredCategory: null,

  // ── Product selection ───────────────────────────────
  selectedCategory: null,

  // ── Customization ───────────────────────────────────
  currentColor: '#c8c8c8',
  currentTexture: 'cotton',
  materialProps: {
    roughness: 0.6,
    metalness: 0.0,
    opacity: 1.0,
    fabricShine: 0.3,
  },

  // ── Viewer state ────────────────────────────────────
  autoRotate: true,
  isLoading: false,
  showCustomization: false,
  viewerZoom: 3.2,

  // ── Cart & Wishlist (Scene 8) ───────────────────────
  cartItems: [],
  wishlistItems: [],

  // ── Settings (Scene 9) ──────────────────────────────
  showSettings: false,
  graphicsQuality: 'high',
  audioVolume: 0.4,
  contrastProfile: 'normal',

  // ── Exit sequence (Scene 11) ────────────────────────
  isExiting: false,

  // ── Actions: Navigation ─────────────────────────────
  setPage: (page) => set({ page }),
  completeSplash: () => set({ splashDone: true, page: 'onboarding' }),
  completeOnboarding: () => set({ onboardingDone: true, page: 'home' }),

  setMotionPreference: (val) => set({ motionPreference: val }),
  setInputDevice: (val) => set({ inputDevice: val }),
  setSoundEnabled: (val) => set({ soundEnabled: val }),

  setHoveredCategory: (category) => set({ hoveredCategory: category }),
  setCurrentColor: (color) => set({ currentColor: color }),
  setCurrentTexture: (texture) => set({ currentTexture: texture }),
  setMaterialProps: (props) => set((state) => ({
    materialProps: { ...state.materialProps, ...props },
  })),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setLoading: (isLoading) => set({ isLoading }),
  setViewerZoom: (zoom) => set({ viewerZoom: zoom }),
  toggleCustomization: () => set((state) => ({ showCustomization: !state.showCustomization })),
  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
  setGraphicsQuality: (val) => set({ graphicsQuality: val }),
  setAudioVolume: (val) => set({ audioVolume: val }),
  setContrastProfile: (val) => set({ contrastProfile: val }),

  // ── Cart actions ────────────────────────────────────
  addToCart: (itemId) => set((state) => {
    if (state.cartItems.includes(itemId)) return state
    return { cartItems: [...state.cartItems, itemId] }
  }),
  removeFromCart: (itemId) => set((state) => ({
    cartItems: state.cartItems.filter((id) => id !== itemId),
  })),
  isInCart: (itemId) => get().cartItems.includes(itemId),

  // ── Wishlist actions ────────────────────────────────
  toggleWishlist: (itemId) => set((state) => {
    if (state.wishlistItems.includes(itemId)) {
      return { wishlistItems: state.wishlistItems.filter((id) => id !== itemId) }
    }
    return { wishlistItems: [...state.wishlistItems, itemId] }
  }),
  isInWishlist: (itemId) => get().wishlistItems.includes(itemId),

  // ── Directory / floor / section navigation ──────────
  enterShowroom: () => set({ page: 'directory' }),
  goToDirectory: () => set({ page: 'directory', hoveredCategory: null }),

  selectFloor: (floorId) => {
    const floor = FLOORS.find((f) => f.id === floorId)
    if (!floor) return
    set({
      currentFloorId: floorId,
      currentSectionId: floor.sections[0].id,
      hoveredCategory: null,
      page: 'showroom',
    })
  },

  selectSection: (sectionId) => set({ currentSectionId: sectionId, hoveredCategory: null }),

  nextFloor: () => set((state) => {
    const idx = FLOORS.findIndex((f) => f.id === state.currentFloorId)
    const next = FLOORS[(idx + 1) % FLOORS.length]
    return { currentFloorId: next.id, currentSectionId: next.sections[0].id, hoveredCategory: null }
  }),
  prevFloor: () => set((state) => {
    const idx = FLOORS.findIndex((f) => f.id === state.currentFloorId)
    const prev = FLOORS[(idx - 1 + FLOORS.length) % FLOORS.length]
    return { currentFloorId: prev.id, currentSectionId: prev.sections[0].id, hoveredCategory: null }
  }),

  selectCategory: (category) => {
    const { floorId, sectionId } = findLocationForCategory(category)
    set({
      selectedCategory: category,
      currentFloorId: floorId,
      currentSectionId: sectionId,
      page: 'viewer',
      isLoading: true,
      autoRotate: true,
      showCustomization: false,
    })
  },

  backToShowroom: () => set({
    page: 'showroom',
    selectedCategory: null,
    hoveredCategory: null,
    autoRotate: false,
    showCustomization: false,
  }),

  resetCustomization: () => set({
    currentColor: '#c8c8c8',
    currentTexture: 'cotton',
    materialProps: { roughness: 0.6, metalness: 0.0, opacity: 1.0, fabricShine: 0.3 },
  }),

  nextCategory: () => set((state) => {
    const list = getSectionCategories(state.currentFloorId, state.currentSectionId).map((c) => c.id)
    if (list.length === 0) return {}
    const idx = list.indexOf(state.selectedCategory)
    const next = list[(idx + 1) % list.length]
    return { selectedCategory: next, isLoading: true, autoRotate: true, showCustomization: false }
  }),
  prevCategory: () => set((state) => {
    const list = getSectionCategories(state.currentFloorId, state.currentSectionId).map((c) => c.id)
    if (list.length === 0) return {}
    const idx = list.indexOf(state.selectedCategory)
    const prev = list[(idx - 1 + list.length) % list.length]
    return { selectedCategory: prev, isLoading: true, autoRotate: true, showCustomization: false }
  }),

  // ── Exit sequence (Scene 11) ─────────────────────────
  startExit: () => set({ isExiting: true }),
  completeExit: () => set({
    page: 'home',
    isExiting: false,
    selectedCategory: null,
    hoveredCategory: null,
    showCustomization: false,
    cartItems: [],
    wishlistItems: [],
  }),
}))

export default useStore
