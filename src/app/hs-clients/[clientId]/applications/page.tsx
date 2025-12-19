import { ClientPageLayout } from "@/features/hs-clients/components/ClientPageLayout";
import { HSClientApplications } from "@/features/hs-clients/components/HSClientApplications";
import { HSClientDetails } from "@/features/hs-clients/components/HSClientDetails";

interface RawParams {
  clientId: string;
}

interface Props {
  params: RawParams | Promise<RawParams>;
}

export default async function ClientApplicationsPage({ params }: Props) {
  const resolvedParams =
    typeof (params as any)?.then === "function"
      ? await params
      : (params as RawParams);

  const clientId = resolvedParams.clientId;

  return (
    <ClientPageLayout>
      <HSClientDetails
        clientId={clientId}
        activeTab="applications"
        showOverview={false}
      >
        <HSClientApplications clientId={clientId} />
      </HSClientDetails>
    </ClientPageLayout>
  );
}
