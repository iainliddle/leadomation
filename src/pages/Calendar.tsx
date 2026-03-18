import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, ExternalLink, Loader2, CalendarCheck, Mail, Zap, Info, CalendarPlus, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ============================================================================
// INTERFACES
// ============================================================================

interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: 'discovery_call' | 'follow_up' | 'negotiation' | 'proposal' | 'personal' | 'manual';
  deal_id?: string;
  lead_id?: string;
  attendee_email?: string;
  attendee_name?: string;
  meeting_link?: string;
  source: 'manual' | 'calendly' | 'cal_com';
  created_at: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const EVENT_TYPE_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  discovery_call: { bg: 'bg-[#EEF2FF]', text: 'text-[#4F46E5]', border: 'border-[#4F46E5]', label: 'Discovery call' },
  follow_up: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-400', label: 'Follow up' },
  negotiation: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-400', label: 'Negotiation' },
  proposal: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-400', label: 'Proposal' },
  personal: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-400', label: 'Personal' },
  manual: { bg: 'bg-gray-50', text: 'text-[#374151]', border: 'border-gray-300', label: 'Meeting' },
};

const EVENT_TYPES = ['discovery_call', 'follow_up', 'negotiation', 'proposal', 'personal', 'manual'] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

function formatDateRange(start: Date, end: Date): string {
  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = start.toLocaleDateString('en-GB', { month: 'short' });
  const year = start.getFullYear();
  return `${startDay}–${endDay} ${month} ${year}`;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: Date[] = [];

  // Add days from previous month to fill the first week
  const firstDayOfWeek = firstDay.getDay();
  const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  for (let i = daysFromPrevMonth; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push(d);
  }

  // Add all days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add days from next month to complete the last week
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }

  return days;
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface EventTypeDropdownProps {
  value: string;
  onChange: (v: string) => void;
}

function EventTypeDropdown({ value, onChange }: EventTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedStyle = EVENT_TYPE_STYLES[value] || EVENT_TYPE_STYLES.manual;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span>{selectedStyle.label}</span>
        <ChevronRight className={`w-4 h-4 text-[#9CA3AF] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 w-full bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1">
            {EVENT_TYPES.map((type) => {
              const style = EVENT_TYPE_STYLES[type];
              const isActive = type === value;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onChange(type);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                      : 'text-[#374151] hover:bg-gray-50'
                  }`}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

interface AddEventModalProps {
  defaultDate: Date | null;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'source'>) => Promise<void>;
}

function AddEventModal({ defaultDate, onClose, onSave }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<string>('discovery_call');
  const [date, setDate] = useState(defaultDate ? defaultDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const endDateTime = new Date(`${date}T${endTime}:00`);

      await onSave({
        title: title.trim(),
        event_type: eventType as CalendarEvent['event_type'],
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        attendee_name: attendeeName.trim() || undefined,
        attendee_email: attendeeEmail.trim() || undefined,
        meeting_link: meetingLink.trim() || undefined,
        description: description.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <CalendarPlus className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <h2 className="text-lg font-semibold text-[#111827]">New event</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="Event title"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Event type</label>
            <EventTypeDropdown value={eventType} onChange={setEventType} />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Attendee name</label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="Contact name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Attendee email</label>
            <input
              type="email"
              value={attendeeEmail}
              onChange={(e) => setAttendeeEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Meeting link</label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
              placeholder="Add notes..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="flex-1 px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Create event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function EventDetailModal({ event, onClose, onDelete }: EventDetailModalProps) {
  const [deleting, setDeleting] = useState(false);
  const style = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES.manual;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setDeleting(true);
    await onDelete(event.id);
  };

  const eventDate = new Date(event.start_time);
  const formattedDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${style.bg} rounded-lg flex items-center justify-center`}>
              <Clock className={`w-5 h-5 ${style.text}`} />
            </div>
            <h2 className="text-lg font-semibold text-[#111827]">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${style.bg} ${style.text}`}>
              {style.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <Clock className="w-4 h-4 text-[#9CA3AF]" />
              <span>{formattedDate}</span>
            </div>
            <div className="text-sm text-[#374151] pl-6">
              {formatTime(event.start_time)} – {formatTime(event.end_time)}
            </div>
          </div>

          {(event.attendee_name || event.attendee_email) && (
            <div className="space-y-1">
              {event.attendee_name && (
                <p className="text-sm text-[#374151]">{event.attendee_name}</p>
              )}
              {event.attendee_email && (
                <p className="text-xs text-[#9CA3AF]">{event.attendee_email}</p>
              )}
            </div>
          )}

          {event.meeting_link && (
            <a
              href={event.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#4F46E5] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Join meeting
            </a>
          )}

          {event.description && (
            <p className="text-sm text-[#374151]">{event.description}</p>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [saving, setSaving] = useState(false);

  const loadEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addEvent = async (eventData: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'source'>) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('calendar_events')
        .insert({
          ...eventData,
          user_id: user.id,
          source: 'manual',
        });

      if (error) throw error;
      await loadEvents();
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const today = new Date();
  const weekStart = startOfWeek(currentDate);
  const weekDays = getWeekDays(weekStart);
  const weekEnd = weekDays[6];
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.start_time), day));
  };

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    const startHour = start.getHours();
    const startMinutes = start.getMinutes();
    const endHour = end.getHours();
    const endMinutes = end.getMinutes();

    const top = ((startHour - 7) * 56) + (startMinutes / 60 * 56);
    const height = ((endHour - startHour) * 56) + ((endMinutes - startMinutes) / 60 * 56);

    return { top: Math.max(0, top), height: Math.max(24, height) };
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowAddModal(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const monthDays = getMonthDays(currentDate);

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#111827]">Calendar</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Manage your meetings and calls</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add event
        </button>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-6">
        {/* Top Bar */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => view === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => view === 'week' ? navigateWeek(1) : navigateMonth(1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#6B7280]" />
            </button>
            <span className="text-sm font-semibold text-[#111827] ml-2">
              {view === 'week' ? formatDateRange(weekStart, weekEnd) : formatMonthYear(currentDate)}
            </span>
          </div>

          <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'week'
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-[#6B7280] hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'month'
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-[#6B7280] hover:bg-gray-50'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#4F46E5]" />
          </div>
        ) : view === 'week' ? (
          /* Week View */
          <div className="overflow-auto">
            {/* Day Headers */}
            <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-gray-100">
              <div className="w-16" />
              {weekDays.map((day, idx) => {
                const isToday = isSameDay(day, today);
                return (
                  <div key={idx} className="py-3 text-center border-r border-gray-50 last:border-r-0">
                    <div className="text-xs font-medium text-[#6B7280]">
                      {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </div>
                    <div
                      className={`text-sm font-semibold mt-0.5 ${
                        isToday
                          ? 'w-7 h-7 rounded-full bg-[#4F46E5] text-white flex items-center justify-center mx-auto'
                          : 'text-[#111827]'
                      }`}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-[64px_repeat(7,1fr)]">
                  <div className="text-xs text-[#9CA3AF] pr-3 text-right pt-1 h-14">
                    {formatHour(hour)}
                  </div>
                  {weekDays.map((day, idx) => (
                    <div
                      key={idx}
                      className="h-14 border-b border-r border-gray-50 relative cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => handleDayClick(day)}
                    />
                  ))}
                </div>
              ))}

              {/* Events Overlay */}
              {weekDays.map((day, dayIdx) => {
                const dayEvents = getEventsForDay(day);
                return dayEvents.map((event) => {
                  const { top, height } = getEventPosition(event);
                  const style = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES.manual;
                  return (
                    <div
                      key={event.id}
                      className={`absolute rounded-lg border-l-2 px-2 py-1 text-xs font-medium cursor-pointer ${style.bg} ${style.text} ${style.border}`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `calc(64px + ${dayIdx} * ((100% - 64px) / 7) + 2px)`,
                        width: `calc((100% - 64px) / 7 - 4px)`,
                      }}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <div className="truncate">{event.title}</div>
                      <div className="text-[10px] opacity-75">
                        {formatTime(event.start_time)} – {formatTime(event.end_time)}
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        ) : (
          /* Month View */
          <div>
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="py-2 text-center text-xs font-medium text-[#6B7280]">
                  {day}
                </div>
              ))}
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-7">
              {monthDays.map((day, idx) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = isSameDay(day, today);
                const dayEvents = getEventsForDay(day);

                return (
                  <div
                    key={idx}
                    className="min-h-[100px] border border-gray-100 p-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleDayClick(day)}
                  >
                    <div
                      className={`text-xs font-semibold mb-1 ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-[#4F46E5] text-white flex items-center justify-center mx-auto'
                          : isCurrentMonth
                          ? 'text-[#111827]'
                          : 'text-[#9CA3AF]'
                      }`}
                    >
                      {day.getDate()}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((event) => {
                        const style = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES.manual;
                        return (
                          <div
                            key={event.id}
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate ${style.bg} ${style.text}`}
                            onClick={(e) => handleEventClick(event, e)}
                          >
                            {event.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-[#6B7280] px-1.5">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Calendar Integrations Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5 mb-6">
        <h3 className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-4">
          Calendar integrations
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Calendly / Cal.com - Connected */}
          <div className="bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#F0F4FF] border border-indigo-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[#111827]">Calendly / Cal.com</h4>
                <p className="text-xs text-[#6B7280] mt-1">
                  When a call is booked via your booking link, it automatically appears in your calendar and moves the deal to Discovery Call Booked.
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-[#4F46E5] bg-white rounded-full px-2 py-0.5 border border-indigo-100">
                    <Zap className="w-[10px] h-[10px]" />
                    Auto-sync active
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-2">
                  Configure your booking URL in Integrations.
                </p>
              </div>
            </div>
          </div>

          {/* Gmail + Outlook - Coming Soon */}
          <div className="bg-gray-50 border border-dashed border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-[18px] h-[18px] text-[#9CA3AF]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[#9CA3AF]">Gmail + Outlook sync</h4>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Two-way sync with your Google or Microsoft calendar. Events created in either direction stay in sync automatically.
                </p>
                <div className="mt-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-[#9CA3AF]">
                    Coming soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl">
        <Info className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#374151]">
          Your calendar shows all discovery calls booked through Leadomation sequences, plus any meetings you add manually. Calls booked via your Calendly or Cal.com link will appear here automatically once a lead books.
        </p>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddEventModal
          defaultDate={selectedDate}
          onClose={() => {
            setShowAddModal(false);
            setSelectedDate(null);
          }}
          onSave={addEvent}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
