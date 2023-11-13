import {
  Button,
  ButtonProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DateRangePicker as DateRangePickerRAC,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  PopoverProps,
  RangeCalendar,
  DateRangePickerProps,
  DateValue,
} from "react-aria-components";
import ChevronDownIcon from "@spectrum-icons/workflow/ChevronDown";
import ChevronLeftIcon from "@spectrum-icons/workflow/ChevronLeft";
import ChevronRightIcon from "@spectrum-icons/workflow/ChevronRight";

function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="text-white w-9 h-9 outline-none cursor-default bg-transparent text-gray-600 border-0 rounded-full d-flex align-items-center justify-content-center"
    />
  );
}

function MyPopover(props: PopoverProps) {
  return (
    <Popover
      {...props}
      className={({isEntering, isExiting}) => `
        overflow-auto rounded-lg drop-shadow-lg ring-1 ring-black/10 bg-white
        ${
          isEntering
            ? "animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 ease-out duration-200"
            : ""
        }
        ${
          isExiting
            ? "animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 ease-in duration-150"
            : ""
        }
      `}
    />
  );
}

export const DateRangePicker = <T extends DateValue>(props: DateRangePickerProps<T>) => {
  return (
    <DateRangePickerRAC
      {...props}
      className="bg-dark text-white d-flex flex-row h-100 align-items-center justify-content-between gap-3"
    >
      <Label className="d-none py-3 pl-3 ">Select date</Label>
      <Group className="d-flex align-items-center justify-content-around gap-3 px-3">
        <DateInput slot="start" className="d-flex flex-1 py-2">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-1 tabular-nums outline-none rounded-sm focus:bg-violet-700 focus:text-white caret-transparent placeholder-shown:italic"
            />
          )}
        </DateInput>
        <span aria-hidden="true">–</span>
        <DateInput slot="end" className="d-flex flex-1 py-2">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-1 tabular-nums outline-none rounded-sm focus:bg-violet-700 focus:text-white caret-transparent placeholder-shown:italic"
            />
          )}
        </DateInput>
        <RoundButton className="outline-none px-3 flex items-center text-white transition border-0 border-solid border-l border-l-purple-200 bg-transparent rounded-r-lg pressed:bg-purple-100 focus-visible:ring-2 ring-black">
          <ChevronDownIcon />
        </RoundButton>
      </Group>
      <MyPopover placement="top right">
        <Dialog className="p-3 bg-dark text-white">
          <RangeCalendar>
            <header className="d-flex align-items-center justify-content-between gap-3 mb-2">
              <RoundButton slot="previous">
                <ChevronLeftIcon />
              </RoundButton>
              <Heading className="flex-1 font-semibold mb-0 my-1 h4" />
              <RoundButton slot="next">
                <ChevronRightIcon />
              </RoundButton>
            </header>
            <CalendarGrid className="w-100 h-100 border-spacing-1 border-separate">
              <CalendarGridHeader className="">
                {(day) => (
                  <CalendarHeaderCell className="font-semibold text-center ">
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className={({
                      isSelected,
                      isHovered,
                      isSelectionStart,
                      isSelectionEnd,
                      isOutsideMonth,
                    }) => {
                      const classNames = [];
                      if (isSelected && !isHovered) {
                        classNames.push("bg-white text-dark");
                      }
                      if (isOutsideMonth) {
                        classNames.push("text-muted");
                      }
                      if (isHovered) {
                        classNames.push("bg-dark-light text-white");
                      }
                      if (isHovered && !isSelected) {
                        classNames.push("rounded-circle");
                      }
                      if (isSelectionEnd && !isSelectionStart) {
                        classNames.push("rounded-end-circle");
                      }
                      if (isSelectionStart && !isSelectionEnd) {
                        classNames.push("rounded-start-circle");
                      }
                      if (isSelectionStart && isSelectionEnd) {
                        classNames.push("rounded-circle");
                      }

                      return `w-9 h-9 outline-none cursor-default  d-flex align-items-center justify-content-center ${classNames.join(
                        " "
                      )}`;
                    }}
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </MyPopover>
    </DateRangePickerRAC>
  );
};
