import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ItemType } from '@/types';

const Submit = () => {
  const [type, setType] = useState<ItemType>('event');

  return (
    <div className="px-4 py-4 space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">Share an event or drop with the community. All submissions are reviewed before publishing.</p>
      </div>

      {/* Type toggle */}
      <div className="flex gap-2">
        {(['event', 'drop'] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              'flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors',
              type === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}
          >
            {t === 'event' ? '🎌 Event' : '📦 Drop'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); }}>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Title *</label>
          <input className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" placeholder="e.g. CONQuest Festival 2026" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Source Link *</label>
          <input className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" placeholder="https://..." />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
          <textarea rows={3} className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none" placeholder="What's this about?" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</label>
            <input type="date" className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">City</label>
            <input className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" placeholder="e.g. Pasay City" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Location / Shop</label>
          <input className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" placeholder="e.g. SMX Convention Center" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Tags (comma separated)</label>
          <input className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" placeholder="cosplay, anime, convention" />
        </div>
        <Button type="submit" className="w-full">Submit for Review</Button>
      </form>
    </div>
  );
};

export default Submit;
