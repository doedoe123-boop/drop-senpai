import { Bookmark } from 'lucide-react';

const Saved = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="rounded-full bg-secondary p-4 mb-4">
        <Bookmark className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="font-heading text-lg font-semibold">No saved items yet</h2>
      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
        Tap the bookmark icon on any event or drop to save it here for quick access.
      </p>
    </div>
  );
};

export default Saved;
