import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page:
          paginatedTransactions === null
            ? 0
            : paginatedTransactions.nextPage === null
            ? 0
            : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      } else if (paginatedTransactions?.nextPage === null) {
        return previousResponse
      } else {
        return { data: [...previousResponse.data, ...response.data], nextPage: response.nextPage }
      }
    })
  }, [fetchWithCache, paginatedTransactions])
  const Allemployee = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }
      return previousResponse
    })
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData, Allemployee }
}
