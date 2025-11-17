import { useBanner } from "@/hooks/use-banner";
import { BannerNotification } from "@/components/ui/banner-notification";

export function BannerContainer() {
  const { type, message, isVisible, hideBanner } = useBanner();

  if (!isVisible || !type) return null;

  return (
    <BannerNotification
      type={type}
      message={message}
      onClose={hideBanner}
    />
  );
}
