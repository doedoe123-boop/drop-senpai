import { cn } from '@/lib/utils';
import type { ItemType } from '@/types';

interface ItemBadgeProps {
  type: ItemType;
  size?: 'sm' | 'md';
}

const ItemBadge = ({ type, size = 'sm' }: ItemBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-heading font-semibold uppercase tracking-wider',
        size === 'sm' && 'px-1.5 py-0.5 text-[10px]',
        size === 'md' && 'px-2 py-1 text-xs',
        type === 'event' && 'bg-event/15 text-event',
        type === 'drop' && 'bg-drop/15 text-drop'
      )}
    >
      {type === 'event' ? '🎌 Event' : '📦 Drop'}
    </span>
  );
};

export default ItemBadge;
