import { useCallback, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams, Transaction } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()
  const [newTransaction, setNewTransaction] = useState<Transaction[] | null>(transactions ?? null)

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
      const transactionToUpdate = transactions?.find((transaction) => transaction.id === transactionId)
      if (transactionToUpdate) {
        const updatedTransaction = { ...transactionToUpdate, approved: newValue }
        const updatedTransactions = transactions?.map((transaction) =>
          transaction.id === transactionToUpdate.id ? updatedTransaction : transaction
        )
        setNewTransaction(updatedTransactions ?? null)
      }
    },
    [fetchWithoutCache, transactions]
  )
  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }
  const updatedTransactionData = newTransaction === null ? transactions : newTransaction
  return (
    <div data-testid="transaction-container">
      {updatedTransactionData?.map((transaction) => (
        <TransactionPane
          key={transaction?.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
