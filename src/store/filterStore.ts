import type { SearchRequestFilter } from '@app-types/filter'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

export interface FilterStoreState {
	selectedFilters: SearchRequestFilter
	setSelectedFilters: (filters: SearchRequestFilter) => void
	resetFilters: () => void
}

export const filterStore = createStore<FilterStoreState>()(
	persist(
		set => ({
			selectedFilters: [],
			setSelectedFilters: filters => set({ selectedFilters: filters }),
			resetFilters: () => set({ selectedFilters: [] })
		}),
		{
			name: 'filter-store',
			storage: createJSONStorage(() => sessionStorage),
			partialize: state => ({ selectedFilters: state.selectedFilters })
		}
	)
)
