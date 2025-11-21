import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MURAL_PAY_CONFIG } from "@/config/mural-pay";
import muralPayClient from "@/lib/mural-pay";
export default async function DashboardPage() {
  const searchPayoutRequestsResp = await muralPayClient.searchPayoutRequests(
    {
      filter: {
        statuses: ["AWAITING_EXECUTION", "PENDING"],
        type: "payoutStatus",
      },
    },
    {
      "on-behalf-of": MURAL_PAY_CONFIG.organizationId,
      limit: 25,
    }
  );

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">Withdrawals</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payouts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchPayoutRequestsResp?.data?.results?.map((payoutRequest) => (
            <TableRow key={payoutRequest.id}>
              <TableCell>#{payoutRequest.id}</TableCell>
              <TableCell>
                {new Date(payoutRequest.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{payoutRequest.status}</Badge>
              </TableCell>
              <TableCell>
                <ul>
                  {payoutRequest.payouts.map((payout) => (
                    <li key={payout.id}>
                      {payout.amount.tokenAmount} {payout.amount.tokenSymbol}
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ))}
          {searchPayoutRequestsResp?.data?.results?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>No withdrawals found</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Withdrawals Count</TableCell>
            <TableCell>{searchPayoutRequestsResp.data.total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
