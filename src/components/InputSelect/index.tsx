import Downshift from "downshift"
import { useCallback, useContext, useState } from "react"
import classNames from "classnames"
import { InputSelectOnChange, InputSelectProps } from "./types"
import { AppContext } from "src/utils/context"

export function InputSelect<TItem>({
  label,
  defaultValue,
  onChange: consumerOnChange,
  items,
  parseItem,
  isLoading,
  loadingLabel,
  loadAllTransactions,
}: InputSelectProps<TItem>) {
  const [selectedValue, setSelectedValue] = useState<TItem | null>(defaultValue ?? null)
  const { setInputValue } = useContext(AppContext)
  const onChange = useCallback<InputSelectOnChange<TItem>>(
    (selectedItem: any) => {
      if (selectedItem.id === "") {
        return [loadAllTransactions(), setSelectedValue(defaultValue ?? null), setInputValue("")]
      } else {
        consumerOnChange(selectedItem)
        setSelectedValue(selectedItem)
      }
      setInputValue(selectedItem.id)
    },
    [consumerOnChange, selectedValue, loadAllTransactions, setInputValue]
  )
  return (
    <Downshift<TItem>
      id="RampSelect"
      onChange={onChange}
      selectedItem={selectedValue}
      itemToString={(item) => (item ? parseItem(item).label : "")}
    >
      {({
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        selectedItem,
        getToggleButtonProps,
        inputValue,
      }) => {
        const toggleProps = getToggleButtonProps()
        const parsedSelectedItem = selectedItem === null ? null : parseItem(selectedItem)
        return (
          <div className="RampInputSelect--root">
            <label className="RampText--s RampText--hushed" {...getLabelProps()}>
              {label}
            </label>
            <div className="RampBreak--xs" />
            <div
              className="RampInputSelect--input"
              onClick={(event) => {
                // setDropdownPosition(getDropdownPosition(event.target))
                toggleProps.onClick(event)
              }}
            >
              {inputValue}
            </div>

            <div
              className={classNames("RampInputSelect--dropdown-container", {
                "RampInputSelect--dropdown-container-opened": isOpen,
              })}
              {...getMenuProps()}
              // style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            >
              {renderItems()}
            </div>
          </div>
        )

        function renderItems() {
          if (!isOpen) {
            return null
          }

          if (isLoading) {
            return <div className="RampInputSelect--dropdown-item">{loadingLabel}...</div>
          }

          if (items.length === 0) {
            return <div className="RampInputSelect--dropdown-item">No items</div>
          }

          return items.map((item, index) => {
            const parsedItem = parseItem(item)

            return (
              <div
                key={parsedItem?.value}
                {...getItemProps({
                  key: parsedItem?.value,
                  index,
                  item,
                  className: classNames("RampInputSelect--dropdown-item", {
                    "RampInputSelect--dropdown-item-highlighted": highlightedIndex === index,
                    "RampInputSelect--dropdown-item-selected":
                      parsedSelectedItem?.value === parsedItem?.value,
                  }),
                })}
              >
                {parsedItem?.label}
              </div>
            )
          })
        }
      }}
    </Downshift>
  )
}
