import { useState } from "react";
import { Card } from "../common";
import type { CalendarEvent } from "../../types";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  format as formatDate,
} from "date-fns";

interface ScheduleCalendarProps {
  events: CalendarEvent[];
  role: string;
}

const eventTypeColors: Record<string, string> = {
  class: "bg-blue-500",
  exam: "bg-red-500",
  meeting: "bg-yellow-500",
  event: "bg-green-500",
  holiday: "bg-purple-500",
};

export function ScheduleCalendar({ events, role }: ScheduleCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });

  const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  const getEventAtTime = (date: Date, hour: number) => {
    return events.find((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date) && eventDate.getHours() === hour;
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            ← Prev
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Next →
          </button>
          <span
            className="ml-4 text-sm font-medium text-gray-700"
            title={`Role: ${role}`}
          >
            {formatDate(weekStart, "MMM d, yyyy")} -{" "}
            {formatDate(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-16 p-2 border bg-gray-50 text-xs font-medium text-gray-600">
                Time
              </th>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, i) => {
                  const date = new Date(weekStart);
                  date.setDate(date.getDate() + i);
                  const isToday = isSameDay(date, new Date());
                  return (
                    <th
                      key={day}
                      className={`p-2 border text-xs font-medium ${
                        isToday
                          ? "bg-primary-100 text-primary-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      <div>{day}</div>
                      <div className="font-bold">{formatDate(date, "d")}</div>
                    </th>
                  );
                },
              )}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((hour) => (
              <tr key={hour}>
                <td className="p-2 border text-xs text-gray-500 bg-gray-50">
                  {format(new Date(2000, 0, 1, hour), "h a")}
                </td>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const date = new Date(weekStart);
                  date.setDate(date.getDate() + dayIndex);
                  const event = getEventAtTime(date, hour);

                  return (
                    <td key={dayIndex} className="p-1 border h-20 align-top">
                      {event && (
                        <div
                          className={`${eventTypeColors[event.type]} text-white text-xs p-1 rounded mb-1`}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-xs opacity-80">
                            {formatDate(event.start, "h:mm a")}
                          </div>
                          {event.location && (
                            <div className="text-xs opacity-60 truncate">
                              {event.location}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
        {Object.entries(eventTypeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span className="text-xs text-gray-600 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
