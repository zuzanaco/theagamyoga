import { SiteDocument } from "@/components/SiteDocument";
import { localizedMetadata } from "@/lib/i18n/metadata";

export const metadata = localizedMetadata("de");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteDocument language="de">{children}</SiteDocument>;
}
