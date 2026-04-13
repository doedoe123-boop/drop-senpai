import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockItems } from '@/data/mock';
import ItemCard from '@/components/items/ItemCard';
import { cn } from '@/lib/utils';

const typeFilters = ['all', 'event', 'drop'] as const;

const Explore = () => {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<typeof typeFilters[number]>('all');

  const filtered = mockItems.filter(item => {
    if (item.status !== 'approved') return false;
    if (activeType !== 'all' && item.type !== activeType) return false;
    if (query) {
      const q = query.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.tags.some(t => t.includes(q)) || item.city?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events, drops, tags..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Type filter */}
      <div className="flex gap-2">
        {typeFilters.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors',
              activeType === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(item => <ItemCard key={item.id} item={item} />)
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No results found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
