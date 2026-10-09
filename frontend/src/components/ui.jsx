import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const ICON = { size: 16, strokeWidth: 1.75 };

export function PageHead({ title, children, actions }) {
  return (
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
      {actions && <div className="page-actions no-print">{actions}</div>}
    </header>
  );
}

// "Page 1 (Working Capital Schedule)" -> chip "Page 1" + plain schedule name
export function Ref({ value }) {
  const m = /^(.*?)\s*\((.*)\)\s*$/.exec(value || '');
  if (!m) return <span className="ref">{value}</span>;
  return (
    <span className="refline">
      <span className="ref">{m[1]}</span>
      <span>{m[2]}</span>
    </span>
  );
}

export function Severity({ level }) {
  return <span className={`sev sev-${String(level).toLowerCase()}`}>{level}</span>;
}

export function statusTag(status) {
  if (status === 'Resolved') return 'tag tag-ok';
  if (status === 'In Progress') return 'tag tag-warn';
  return 'tag';
}

export function scoreBand(score) {
  if (score >= 75) return { label: 'Strong', tone: 'ok' };
  if (score >= 55) return { label: 'Moderate', tone: 'med' };
  return { label: 'Vulnerable', tone: 'crit' };
}

export function Toasts({ toasts }) {
  return (
    <div className="toasts no-print" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind === 'error' ? 'is-error' : ''}`}>{t.message}</div>
      ))}
    </div>
  );
}

// Esc closes, focus moves in on open and returns to the opener on close.
function useModal(onClose) {
  const ref = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    const el = ref.current;
    el?.querySelector('[data-autofocus]')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && el) {
        const items = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [onClose]);
  return ref;
}

export function ConfirmDialog({ title, body, confirmLabel, onConfirm, onCancel }) {
  const ref = useModal(onCancel);
  return (
    <>
      <div className="scrim" onClick={onCancel} />
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" ref={ref}>
        <h2 id="dlg-title">{title}</h2>
        <p>{body}</p>
        <div className="dialog-actions">
          <button className="btn" data-autofocus onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </>
  );
}

export function Drawer({ label, onClose, head, children, foot }) {
  const ref = useModal(onClose);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={label} ref={ref}>
        <div className="drawer-head">
          <div>{head}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close" data-autofocus>
            <X {...ICON} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {foot && <div className="drawer-foot">{foot}</div>}
      </aside>
    </>
  );
}
