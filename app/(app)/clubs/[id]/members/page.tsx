export default function ClubMembersPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>Club Members</h2>
      <div className="glass-card p-6 text-sm text-[var(--text2)]">
        Club ID: {params.id} — Member management coming soon.
      </div>
    </div>
  );
}
