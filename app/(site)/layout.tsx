// ============================================================
// app/(site)/layout.tsx - Layout cho site (không cần extra wrapper)
// ============================================================
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
