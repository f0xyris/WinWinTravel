import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { FilterItem, SearchRequestFilter } from '@app-types/filter'
import { FilterType } from '@shared/api/types/Filter'
import { useStore } from 'zustand'

import { ConfirmDialog } from '@components/ConfirmDialog'
import { filterStore } from '@store/filterStore'

type Props = {
	isOpen: boolean
	onClose: () => void
	onApply: (next: SearchRequestFilter) => void
	items: FilterItem[]
}

type DraftSelections = Record<string, Set<string>>

export const FilterModal = ({ isOpen, onClose, onApply, items }: Props) => {
	const { t } = useTranslation()
	const selectedFilters = useStore(filterStore, state => state.selectedFilters)
	const setSelectedFilters = useStore(
		filterStore,
		state => state.setSelectedFilters
	)

	const [draft, setDraft] = useState<DraftSelections>({})
	const initialFocusRef = useRef<HTMLButtonElement | null>(null)

	const selectedById = useMemo(() => {
		const map: DraftSelections = {}
		for (const selectedFilter of selectedFilters) {
			map[selectedFilter.id] = new Set(selectedFilter.optionsIds)
		}
		return map
	}, [selectedFilters])

	useEffect(() => {
		if (isOpen) {
			setDraft(selectedById)
			queueMicrotask(() => initialFocusRef.current?.focus())
		}
	}, [isOpen, selectedById])

	const handleToggle = (filterId: string, optionId: string) => {
		setDraft(previousDraft => {
			const current = new Set(previousDraft[filterId] ?? [])
			if (current.has(optionId)) {
				current.delete(optionId)
			} else {
				current.add(optionId)
			}
			return { ...previousDraft, [filterId]: current }
		})
	}

	const handleCancel = () => {
		onClose()
	}

	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleApply = () => {
		setConfirmOpen(true)
	}

	const commitApply = () => {
		const next: SearchRequestFilter = Object.entries(draft)
			.map(([id, set]) => ({
				id,
				type: FilterType.OPTION,
				optionsIds: Array.from(set)
			}))
			.filter(requestFilter => requestFilter.optionsIds.length > 0)
		setSelectedFilters(next)
		onApply(next)
		setConfirmOpen(false)
		onClose()
	}

	if (!isOpen) {
		return null
	}

	return (
		<Fragment>
			<div
				className="fixed inset-0 z-50 flex items-center justify-center"
				role="dialog"
				aria-modal="true"
				aria-labelledby="filter-modal-title"
			>
				<div
					className="absolute inset-0 bg-black/40"
					onClick={handleCancel}
				/>

				<div className="relative z-10 mx-4 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
					<header className="flex items-center justify-between px-5">
						<h2
							id="filter-modal-title"
							className="mx-auto w-full text-center text-[20px] font-medium text-[color:var(--color-gray-500)] md:text-[24px] py-6"
						>
							{t('filter.title', { defaultValue: 'Filter' })}
						</h2>
						<button
							ref={initialFocusRef}
							type="button"
							className="brightness-[0] ml-4 rounded px-2 py-1 text-sm text-[color:var(--color-gray-400)] cursor-pointer"
							aria-label={t('filter.close', { defaultValue: 'Close' })}
							onClick={handleCancel}
						>
							✖
						</button>
					</header>

					<section className="h-[70vh] space-y-6 overflow-y-scroll px-5 pb-6 pt-1">
						{items.map(item => {
							const title = t(`filter.${item.id}.name`, {
								defaultValue: item.name
							})
							return (
								<div key={item.id}>
									{/* Top divider for first block */}
									{item.id === 'PRELIMINARY_FILTER' ? (
										<div className="-mt-1 mb-5 border-b border-[color:var(--color-gray-200)]" />
									) : null}
									<div className="mb-4 text-[16px] font-medium text-[color:var(--color-gray-500)]">
										{title}
									</div>
									{(() => {
										const oneCol = item.id === 'FORM_OF_PAYMENT'
										const twoCols =
											item.id === 'CANCELLATION_POLICY' ||
											item.id === 'PREPAYMENT'
										const gridClass = oneCol
											? 'grid grid-cols-1 gap-y-2'
											: twoCols
												? 'grid grid-cols-1 gap-y-2 sm:grid-cols-2 md:grid-cols-2'
												: 'grid grid-cols-1 gap-y-2 sm:grid-cols-2 md:grid-cols-3'
										return (
											<div className={gridClass}>
												{item.options.map(opt => {
													const checked = draft[item.id]?.has(opt.id) ?? false
													const optionLabel = t(
														`filter.${item.id}.options.${opt.id}.name`,
														{ defaultValue: opt.name }
													)
													return (
														<label
															key={opt.id}
															className="relative flex cursor-pointer items-center gap-2 py-1 text-[14px] text-[color:var(--color-gray-500)]"
														>
															<input
																type="checkbox"
																checked={checked}
																onChange={() => handleToggle(item.id, opt.id)}
																className="peer absolute inset-0 h-0 w-0 opacity-0"
															/>
															<span
																aria-hidden
																className="custom-checkbox inline-flex h-4 w-4 items-center justify-center rounded border-2 border-gray-400 bg-transparent transition-colors peer-checked:border-[color:var(--color-brand-200)] peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--color-brand-200)]"
																style={{ color: 'var(--color-brand-300)' }}
															/>
															<span className="select-none">{optionLabel}</span>
														</label>
													)
												})}
											</div>
										)
									})()}
									<div
										className={`border-b border-[color:var(--color-gray-200)] ${item.id === 'SPECIAL_OFFERS' ? 'mt-20' : 'mt-5'}`}
									/>
								</div>
							)
						})}
					</section>

					<footer className="grid grid-cols-3 items-center px-8 py-5">
						<div />
						<div className="flex justify-center">
							<button
								type="button"
								className="rounded-xl min-w-32 h-12 cursor-pointer bg-[color:var(--color-brand-200)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[color:var(--color-brand-300)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-200)]"
								onClick={handleApply}
							>
								{t('filter.apply', { defaultValue: 'Apply' })}
							</button>
						</div>
						<div className="flex justify-end">
							<button
								type="button"
								className="text-xs font-medium text-[color:var(--color-primary-100)] underline underline-offset-4 cursor-pointer"
								onClick={() => setDraft({})}
							>
								{t('filter.clearAll', { defaultValue: 'Clear all parameters' })}
							</button>
						</div>
					</footer>
				</div>
			</div>

			<ConfirmDialog
				isOpen={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={commitApply}
				title="confirm.title"
				confirmLabelKey="confirm.applyNew"
				cancelLabelKey="confirm.useOld"
				alignTop={true}
				maxWidthClass="max-w-5xl"
			/>
		</Fragment>
	)
}
