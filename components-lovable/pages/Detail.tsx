import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { mockItems } from '@/data/mock';
import ItemBadge from '@/components/items/ItemBadge';
import { Button } from '@/components/ui/button';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = mockItems.find(i => i.id === id);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-muted-foreground">Item not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ItemBadge type={item.type} size="md" />
          {item.is_featured && (
            <span className="text-xs font-semibold text-accent">★ Featured</span>
          )}
        </div>
        <h1 className="font-heading text-2xl font-bold leading-tight">{item.title}</h1>
      </div>

      {/* Meta */}
      <div className="mt-4 space-y-2">
        {item.event_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              {format(new Date(item.event_date), 'EEEE, MMMM d, yyyy · h:mm a')}
              {item.end_date && ` – ${format(new Date(item.end_date), 'MMM d, h:mm a')}`}
            </span>
          </div>
        )}
        {item.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{item.location}{item.city ? `, ${item.city}` : ''}{item.region ? ` · ${item.region}` : ''}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <p className="mt-5 text-sm leading-relaxed text-secondary-foreground">{item.description}</p>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map(tag => (
            <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            View Source
          </Button>
        </a>
        <Button variant="outline" size="icon">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Detail;
