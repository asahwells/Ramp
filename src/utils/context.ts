import { createContext } from "react"

export const AppContext = createContext<AppContextProps>({
  setError: () => {},
  inputValue: "",
  setInputValue: () => "",
})

type AppContextProps = {
  setError: (error: string) => void
  cache?: React.MutableRefObject<Map<string, string>>
  inputValue?: string
  setInputValue: (inputValue: string) => string
}
