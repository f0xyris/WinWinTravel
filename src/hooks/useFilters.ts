import type { FilterItem } from '@app-types/filter'
import { useQuery } from '@tanstack/react-query'

interface FilterResponse {
	filterItems?: FilterItem[]
}

export const useFilters = () => {
	const { isLoading, error, data } = useQuery<FilterItem[], Error>({
		queryKey: ['filters'],
		queryFn: async (): Promise<FilterItem[]> => {
			const response = await fetch('/filterData.json', { cache: 'no-store' })
			if (!response.ok) {
				throw new Error(`Failed to fetch filters: ${response.status}`)
			}
			const json: FilterResponse = await response.json()
			return json.filterItems ?? []
		}
	})

	return { isLoading, error, data }
}
