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

  return null;
}
