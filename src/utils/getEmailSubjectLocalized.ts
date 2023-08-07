import { Locale } from '../modules/common/common.dto'

export const getEmailSubjectOrderLocalized = ({ locale }: { locale: Locale }) => {
  if (locale === 'en') return 'Order'
  if (locale === 'tr') return 'Sipariş'
  return 'طلب'
}

export const getEmailSubjectVerificationLocalized = ({ locale }: { locale: Locale }) => {
  if (locale === 'en') return 'Verification'
  if (locale === 'tr') return 'Doğrulama'
  return 'التحقق'
}
