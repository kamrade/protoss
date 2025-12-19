export default function ClientPageLayout({
  children
} : {
  children: React.ReactNode
}) {
  return (
    <section className="ClientPageLayout">
      {children}
    </section>
  );
}