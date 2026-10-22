import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import logoUrl from '../../assets/logo.png';

// شعار المدرسة (الصورة src/assets/logo.png بخلفية شفافة). size: md للشريط الجانبي، lg للوحة الدخول
const SIZES = { md: 'h-14', lg: 'h-28' };

function Logo({ size = 'md' }) {
  const { t } = useI18n();
  return <img src={logoUrl} alt={t('brand.name')} className={`${SIZES[size]} w-auto shrink-0`} draggable={false} />;
}

export default Logo;
