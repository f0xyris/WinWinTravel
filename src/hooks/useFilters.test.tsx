import type { FilterItem } from '@app-types/filter'
import { useFilters } from '@hooks/useFilters'
import { FilterType } from '@shared/api/types/Filter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const createWrapper = () => {
	const client = new QueryClient({
		defaultOptions: { queries: { retry: false } }
	})
	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={client}>{children}</QueryClientProvider>
	)
	return Wrapper
}

afterEach(() => {
	vi.restoreAllMocks()
})

describe('useFilters', () => {
	it('fetches and returns filter items', async () => {
		const mockItems: FilterItem[] = [
			{
				id: 'TEST',
				name: 'Test',
				type: FilterType.OPTION,
				options: [
					{ id: 'a', name: 'A' },
					{ id: 'b', name: 'B' }
				]
			}
		]

		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({ filterItems: mockItems })
		} as unknown as Response)

		const { result } = renderHook(() => useFilters(), {
			wrapper: createWrapper()
		})

		await waitFor(() => expect(result.current.isLoading).toBe(false))
		expect(result.current.error).toBeNull()
		expect(result.current.data).toEqual(mockItems)
	})

	it('exposes error on failed fetch', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: false,
			status: 500
		} as unknown as Response)

		const { result } = renderHook(() => useFilters(), {
			wrapper: createWrapper()
		})

		await waitFor(() => expect(result.current.isLoading).toBe(false))
		expect(result.current.error).toBeInstanceOf(Error)
	})
})
