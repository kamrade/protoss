"use client";

import { useParams } from "next/navigation";

interface RouteParams {
  clientId: string;
  applicationId: string;
}

interface Props {
  params: RouteParams;
}

export default function HSApplicationDocumentsPage({ params }: Props) {

  const { applicationId } = useParams<{ applicationId: string }>();

  return (
    <main className="mx-auto max-w-5xl px-6">
      <h1 className="text-3xl font-semibold text-gray-900">
        Documents for application {applicationId}
      </h1>
    </main>
  );
}
