export default function ClubDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>Club Profile</h2>
      <div className="glass-card p-6 text-sm text-[var(--text2)]">
        Club ID: {params.id} (Coming soon)
      </div>
    </div>
  );
}
