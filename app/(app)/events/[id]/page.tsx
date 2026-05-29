export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>Event Detail</h2>
      <div className="glass-card p-6 text-sm text-[var(--text2)]">
        Event ID: {params.id} (Coming soon)
      </div>
    </div>
  );
}
