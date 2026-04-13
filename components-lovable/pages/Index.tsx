import { mockItems } from '@/data/mock';
import ItemCard from '@/components/items/ItemCard';

const Index = () => {
  const featured = mockItems.filter(i => i.is_featured);
  const events = mockItems.filter(i => i.type === 'event' && i.status === 'approved');
  const drops = mockItems.filter(i => i.type === 'drop' && i.status === 'approved');

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Featured */}
      <section>
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          ★ Featured
        </h2>
        <div className="space-y-3">
          {featured.map(item => (
            <ItemCard key={item.id} item={item} variant="featured" />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Upcoming Events
        </h2>
        <div className="space-y-3">
          {events.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Latest Drops */}
      <section>
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Latest Drops
        </h2>
        <div className="space-y-3">
          {drops.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
