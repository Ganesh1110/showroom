import { create } from 'zustand'

const useStore = create((set) => ({
  page: 'home',
  selectedCategory: null,
  currentColor: '#ffffff',
  currentTexture: 'cotton',
  materialProps: {
    roughness: 0.6,
    metalness: 0.0,
    opacity: 1.0,
    fabricShine: 0.3,
  },
  autoRotate: true,
  isLoading: false,
  showCustomization: false,

  setPage: (page) => set({ page }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setCurrentColor: (color) => set({ currentColor: color }),
  setCurrentTexture: (texture) => set({ currentTexture: texture }),
  setMaterialProps: (props) => set((state) => ({
    materialProps: { ...state.materialProps, ...props },
  })),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleCustomization: () => set((state) => ({ showCustomization: !state.showCustomization })),

  enterShowroom: () => set({ page: 'showroom' }),
  selectCategory: (category) => set({
    selectedCategory: category,
    page: 'viewer',
    isLoading: true,
    autoRotate: true,
  }),
  backToShowroom: () => set({
    page: 'showroom',
    selectedCategory: null,
    autoRotate: false,
  }),
  resetCustomization: () => set({
    currentColor: '#ffffff',
    currentTexture: 'cotton',
    materialProps: { roughness: 0.6, metalness: 0.0, opacity: 1.0, fabricShine: 0.3 },
  }),
}))

export default useStore
