// NotificationTemplate.tsx  (renamed/refactored example — or just delete it)

import NotificationCard from './NotificationCard';
import { Notification } from './NotificationApi';

type NotificationTemplateProps = {
  item: Notification;
  onClose: () => void;
  className?: string;
};

/**
 * Reusable notification display wrapper (no snackbar dependency).
 * Use this directly in drawers, toasts, modals, etc.
 */
function NotificationTemplate(props: NotificationTemplateProps) {
  const { item, onClose, className } = props;

  return (
    <div className={`pointer-events-auto w-full max-w-80 ${className || ''}`}>
      <NotificationCard item={item} onClose={onClose} />
    </div>
  );
}

export default NotificationTemplate;