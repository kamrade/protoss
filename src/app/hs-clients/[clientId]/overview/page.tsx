import { HSClientDetails } from "@/features/hs-clients/components/HSClientDetails";

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
    <main className="mx-auto max-w-5xl px-6">
      <h1 className="text-3xl font-semibold text-gray-900">
        Overview of the client {clientId}
      </h1>
    </main>
  );
}
