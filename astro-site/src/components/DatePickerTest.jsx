import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function DatePickerTest() {
  const [date, setDate] = useState()

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Date Picker Test</h2>
      <p style={{ marginBottom: '1rem' }}>Testing shadcn/ui Calendar and Popover components</p>
      <div style={{ marginTop: '1rem' }}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {date && (
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Selected date: {format(date, "MMMM d, yyyy")}
          </p>
        )}
      </div>
    </div>
  )
}
