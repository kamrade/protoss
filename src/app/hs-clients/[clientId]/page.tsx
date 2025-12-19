import { HSClientDetails } from "@/features/hs-clients/components/HSClientDetails";
import { ClientPageLayout } from "@/features/hs-clients/components/ClientPageLayout";

interface RawParams {
  clientId: string;
}

interface Props {
  params: RawParams | Promise<RawParams>;
}

export default async function ClientPage({ params }: Props) {
  const resolvedParams = (typeof (params as any)?.then === "function")
    ? await params
    : (params as RawParams);

  const clientId = resolvedParams?.clientId;

  return (
    <ClientPageLayout>
      <HSClientDetails clientId={clientId} activeTab="overview" />
    </ClientPageLayout>
  );
}
