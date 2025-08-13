import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilters } from '@hooks/useFilters'
import { useStore } from 'zustand'

import { FilterModal } from '@components/FilterModal'
import { filterStore } from '@store/filterStore'

export const App = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)

	const selectedFilters = useStore(filterStore, state => state.selectedFilters)
	const setSelectedFilters = useStore(
		filterStore,
		state => state.setSelectedFilters
	)

	const { data: items = [], isLoading, error } = useFilters()

	return (
		<section className="w-full h-dvh flex flex-col items-center justify-center gap-6 px-4">
			<h1 className="text-4xl md:text-6xl text-gray-600 mb-2 text-center">
				{t('home.title', { defaultValue: 'WinWinTravel frontend test task' })}
			</h1>

			<div className="flex items-center gap-3">
				<button
					type="button"
					className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					onClick={() => setOpen(true)}
				>
					{t('filter.open', { defaultValue: 'Open Filters' })}
				</button>
			</div>

			<div className="w-full max-w-2xl rounded border p-4 bg-white shadow">
				<h2 className="mb-2 text-sm font-semibold text-gray-900">
					{t('filter.debugTitle', { defaultValue: 'Selected filters (debug)' })}
				</h2>
				<pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs text-gray-700">
					{JSON.stringify(selectedFilters, null, 2)}
				</pre>
			</div>

			<FilterModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onApply={next => {
					setSelectedFilters(next)
				}}
				items={items}
			/>

			{isLoading ? (
				<p className="text-sm text-gray-500">
					{t('filter.loading', { defaultValue: 'Loading filters…' })}
				</p>
			) : null}
			{error ? (
				<p className="text-sm text-red-600">
					{t('filter.error', { defaultValue: 'Failed to load filters' })}
				</p>
			) : null}
		</section>
	)
}
