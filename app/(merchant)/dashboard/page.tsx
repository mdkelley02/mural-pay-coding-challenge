export default async function DashboardPage() {
  const withdrawals: any[] = [];
  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">Withdrawals</div>

      <ul className="space-y-2">
        {withdrawals.map((withdrawal, index) => (
          <li key={index}>{JSON.stringify(withdrawal)}</li>
        ))}
      </ul>
    </div>
  );
}
