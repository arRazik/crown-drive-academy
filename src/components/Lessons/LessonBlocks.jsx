import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import { tone } from '../../theme/status';

// يعرض صفحة الدرس المبنية بالبلوكات في لوحة الإدارة (مثل Elementor) كما صُمّمت.
// نسخة للمعاينة في Dashbord/src/components/builder/LessonBlocks.jsx — الألوان هنا من
// src/theme.css (أسماء دلالية) بينما نسخة لوحة الإدارة تستعمل ألوانها الخاصة.

const CALLOUT_TONE = { info: 'primary', warning: 'warning', danger: 'danger', success: 'success' };

const CALLOUT_ICONS = { info: 'ℹ️', warning: '⚠️', danger: '⛔', success: '✅' };

function Figure({ url, caption, className = '' }) {
  if (!url) return null;
  return (
    <figure className={className}>
      <img src={url} alt={caption || ''} className="w-full rounded-xl border border-line bg-surface-2 object-contain" />
      {caption && <figcaption className="mt-2 text-center text-xs text-ink-faint">{caption}</figcaption>}
    </figure>
  );
}

function Block({ block, dir }) {
  switch (block.type) {
    case 'heading':
      return block.level === 3 ? (
        <h3 className="text-lg font-bold text-ink">{block.text}</h3>
      ) : (
        <h2 className="border-s-4 border-accent ps-3 text-xl font-bold text-ink">{block.text}</h2>
      );
    case 'paragraph':
      return <p className="leading-8 whitespace-pre-line text-ink-soft">{block.text}</p>;
    case 'image':
      return <Figure url={block.url} caption={block.caption} className="mx-auto max-w-xl" />;
    case 'image_text': {
      // image_side وضعه المدير بالاتجاه الفعلي (يمين/يسار) — نعكس الترتيب حسب اتجاه الصفحة
      const imageOnLeft = block.image_side === 'left';
      const reverse = dir === 'rtl' ? imageOnLeft : !imageOnLeft;
      return (
        <div className={`flex flex-col items-center gap-5 sm:flex-row ${reverse ? 'sm:flex-row-reverse' : ''}`}>
          <Figure url={block.url} caption={block.caption} className="w-full shrink-0 sm:w-2/5" />
          <p className="flex-1 leading-8 whitespace-pre-line text-ink-soft">{block.text}</p>
        </div>
      );
    }
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={`${block.ordered ? 'list-decimal' : 'list-disc'} space-y-1.5 ps-6 leading-7 text-ink-soft`}>
          {block.items.filter((i) => i.trim()).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case 'callout': {
      const calloutTone = CALLOUT_TONE[block.tone] || 'primary';
      return (
        <div className={`flex gap-3 rounded-xl border border-s-4 px-4 py-3 ${tone(calloutTone).soft}`}>
          <span aria-hidden="true">{CALLOUT_ICONS[block.tone] || CALLOUT_ICONS.info}</span>
          <p className="leading-7 whitespace-pre-line">{block.text}</p>
        </div>
      );
    }
    case 'divider':
      return <hr className="border-line" />;
    default:
      return null;
  }
}

function LessonBlocks({ blocks }) {
  const { dir } = useI18n();
  return (
    <div className="space-y-6">
      {(blocks || []).map((block) => (
        <Block key={block.id} block={block} dir={dir} />
      ))}
    </div>
  );
}

export default LessonBlocks;
