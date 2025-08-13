import 'i18next'

import { resources } from '../public/locales'
import { I18N_DEFAULT_NS } from './constants'

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: typeof I18N_DEFAULT_NS
		resources: typeof resources.en
	}
}
