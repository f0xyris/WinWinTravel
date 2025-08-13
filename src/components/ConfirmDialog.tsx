import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
	isOpen: boolean
	onConfirm: () => void
	onCancel: () => void
	title: string
	message?: string
	confirmLabelKey?: string
	cancelLabelKey?: string
	alignTop?: boolean
	maxWidthClass?: string
}

export const ConfirmDialog = ({
	isOpen,
	onConfirm,
	onCancel,
	title,
	message,
	confirmLabelKey,
	cancelLabelKey,
	alignTop = true,
	maxWidthClass = 'max-w-5xl'
}: Props) => {
	const { t } = useTranslation()
	const initialFocusRef = useRef<HTMLButtonElement | null>(null)

	useEffect(() => {
		if (isOpen) {
			queueMicrotask(() => initialFocusRef.current?.focus())
		}
	}, [isOpen])

	if (!isOpen) {
		return null
	}

	const translatedTitle = t(title, { defaultValue: title })
	const translatedMessage = message ? t(message, { defaultValue: message }) : ''

	return (
		<div
			className={`fixed inset-0 z-50 flex ${alignTop ? 'items-start pt-10' : 'items-center'} justify-center`}
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
			aria-describedby={message ? 'confirm-dialog-description' : undefined}
		>
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onCancel}
			/>

			<div
				className={`fixed top-1/4 z-10 mx-4 w-full ${maxWidthClass} overflow-hidden rounded-2xl bg-white shadow-xl`}
			>
				<header className="flex items-start justify-between px-8 py-6 pb-20">
					<h2
						id="confirm-dialog-title"
						className="mx-auto w-full text-center text-3xl font-semibold text-gray-900"
					>
						{translatedTitle}
					</h2>
					<button
						aria-label={t('filter.close', { defaultValue: 'Close' })}
						onClick={onCancel}
						className="absolute right-3 brightness-[0] ml-4 rounded-full px-2 text-gray-500 cursor-pointer"
						type="button"
					>
						✖
					</button>
				</header>
				<section className="px-8 pb-2 text-center">
					{translatedMessage ? (
						<p
							id="confirm-dialog-description"
							className="text-sm text-gray-700"
						>
							{translatedMessage}
						</p>
					) : null}
				</section>
				<footer className="flex items-center justify-center gap-4 px-8 pb-8">
					<button
						ref={initialFocusRef}
						type="button"
						className="rounded-xl border border-gray-300 bg-white px-15 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
						onClick={onCancel}
					>
						{t(cancelLabelKey ?? 'confirm.no', { defaultValue: 'No' })}
					</button>
					<button
						type="button"
						className="rounded-xl bg-orange-500 px-15 py-3.5 text-sm font-semibold text-white hover:bg-orange-600 cursor-pointer"
						onClick={onConfirm}
					>
						{t(confirmLabelKey ?? 'confirm.yes', { defaultValue: 'Yes' })}
					</button>
				</footer>
			</div>
		</div>
	)
}
