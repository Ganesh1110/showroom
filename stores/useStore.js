import { create } from 'zustand'
import { FLOORS, getSectionCategories, findLocationForCategory } from '../utils/garments'

const FIRST_FLOOR = FLOORS[0]
const FIRST_SECTION = FIRST_FLOOR.sections[0]

const useStore = create((set) => ({
  // ── Navigation ──────────────────────────────────────
  // 'splash' | 'home' | 'directory' | 'showroom' | 'viewer'
  page: 'splash',
  splashDone: false,

  // ── Showroom location (floor + section) ─────────────
  currentFloorId: FIRST_FLOOR.id,
  currentSectionId: FIRST_SECTION.id,
  hoveredCategory: null,   // for pedestal preview in showroom

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
  viewerZoom: 3.2,         // camera Z distance (maps to slider)

  // ── Actions ─────────────────────────────────────────
  setPage: (page) => set({ page }),
  completeSplash: () => set({ splashDone: true, page: 'home' }),
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

  // Move up/down a floor without returning to the directory lobby
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
    // Keep floor/section navigation in sync with whatever category was picked,
    // even if it was chosen from outside the showroom (e.g. the Home page strip).
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

  // Navigate to next / prev category — scoped to the current section, so
  // browsing in the viewer mirrors the section you entered from.
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
}))

export default useStore
