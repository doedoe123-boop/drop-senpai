import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { EmptyState } from "../../../src/components/empty-state";
import { ErrorState } from "../../../src/components/error-state";
import { LoadingState } from "../../../src/components/loading-state";
import { ScreenShell } from "../../../src/components/screen-shell";
import { ItemDetailContent } from "../../../src/features/items/components/item-detail-content";
import { useApprovedItem } from "../../../src/features/items/hooks/use-approved-item";

export default function ItemDetailScreen() {
  const params = useLocalSearchParams<{ itemId: string }>();
  const itemId = Array.isArray(params.itemId) ? params.itemId[0] : params.itemId;
  const approvedItem = useApprovedItem(itemId);

  return (
    <ScreenShell>
      {approvedItem.isLoading ? <LoadingState label="Loading item details..." /> : null}
      {approvedItem.isError ? (
        <ErrorState
          title="Could not load this item"
          description="The item may be missing, not approved, or the app could not reach Supabase."
          onRetry={() => approvedItem.refetch()}
        />
      ) : null}
      {approvedItem.isSuccess ? (
        <ItemDetailContent item={approvedItem.data} />
      ) : null}
      {!itemId ? (
        <View>
          <EmptyState title="Missing item ID" description="Open this screen from the home feed to load an item." />
        </View>
      ) : null}
    </ScreenShell>
  );
}
