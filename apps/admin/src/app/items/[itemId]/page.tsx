import { PageShell } from "../../../components/page-shell";
import { AdminGuard } from "../../../features/auth/components/admin-guard";
import { ReviewForm } from "../../../features/moderation/components/review-form";

interface ItemReviewPageProps {
  params: Promise<{
    itemId: string;
  }>;
}

export default async function ItemReviewPage({ params }: ItemReviewPageProps) {
  const { itemId } = await params;

  return (
    <PageShell>
      <AdminGuard>
        <ReviewForm itemId={itemId} />
      </AdminGuard>
    </PageShell>
  );
}
