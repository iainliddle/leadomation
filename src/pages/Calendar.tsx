import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Loader2, CalendarCheck, Mail, Zap, Info, CalendarPlus, Clock, CheckCircle } from 'lucide-react';
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
  defaultStartTime?: string;
  defaultEndTime?: string;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'source'>) => Promise<void>;
}

function AddEventModal({ defaultDate, defaultStartTime, defaultEndTime, onClose, onSave }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<string>('discovery_call');
  const [date, setDate] = useState(defaultDate ? defaultDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(defaultStartTime || '09:00');
  const [endTime, setEndTime] = useState(defaultEndTime || '10:00');
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

interface EditEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onSave: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  onDelete: (id: string) => void;
}

function EditEventModal({ event, onClose, onSave, onDelete }: EditEventModalProps) {
  const [title, setTitle] = useState(event.title);
  const [eventType, setEventType] = useState<string>(event.event_type);
  const [date, setDate] = useState(new Date(event.start_time).toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(
    new Date(event.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
  const [endTime, setEndTime] = useState(
    new Date(event.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
  const [attendeeName, setAttendeeName] = useState(event.attendee_name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(event.attendee_email || '');
  const [meetingLink, setMeetingLink] = useState(event.meeting_link || '');
  const [description, setDescription] = useState(event.description || '');
  const [saving, setSaving] = useState(false);

  const style = EVENT_TYPE_STYLES[eventType] || EVENT_TYPE_STYLES.manual;

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const endDateTime = new Date(`${date}T${endTime}:00`);

      await onSave(event.id, {
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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${style.bg} rounded-lg flex items-center justify-center`}>
              <Clock className={`w-5 h-5 ${style.text}`} />
            </div>
            <h2 className="text-lg font-semibold text-[#111827]">{title || 'Edit event'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Title</label>
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
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Event type</label>
            <EventTypeDropdown value={eventType} onChange={setEventType} />
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Attendee name</label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="Contact name"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Attendee email</label>
            <input
              type="email"
              value={attendeeEmail}
              onChange={(e) => setAttendeeEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Meeting link</label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
              placeholder="Add notes..."
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Calendar: React.FC = () => {
  useEffect(() => {
    document.title = 'Calendar | Leadomation';
    return () => { document.title = 'Leadomation'; };
  }, []);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | undefined>(undefined);
  const [selectedEndTime, setSelectedEndTime] = useState<string | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

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

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const { error } = await supabase.from('calendar_events').update(updates).eq('id', id);
      if (error) throw error;
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error updating event:', err);
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
    setSelectedStartTime(undefined);
    setSelectedEndTime(undefined);
    setShowAddModal(true);
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    setSelectedDate(day);
    const startHour = hour.toString().padStart(2, '0');
    const endHour = (hour + 1).toString().padStart(2, '0');
    setSelectedStartTime(`${startHour}:00`);
    setSelectedEndTime(`${endHour}:00`);
    setShowAddModal(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const monthDays = getMonthDays(currentDate);

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      {/* Calendar Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
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

          <div className="flex items-center gap-3">
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
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setSelectedStartTime(undefined);
                setSelectedEndTime(undefined);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]"
            >
              <Plus size={14} />
              Add event
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
                const isLastColumn = idx === 6;
                return (
                  <div key={idx} className={`py-3 text-center border-r border-gray-100 ${isLastColumn ? 'border-r-0' : ''}`}>
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
                  {weekDays.map((day, idx) => {
                    const isLastColumn = idx === 6;
                    return (
                      <div
                        key={idx}
                        className={`h-14 border-b border-gray-50 relative cursor-pointer hover:bg-indigo-50 transition-colors border-r border-gray-100 ${isLastColumn ? 'border-r-0' : ''}`}
                        onClick={() => handleTimeSlotClick(day, hour)}
                      />
                    );
                  })}
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
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5 mt-4">
        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-4">Calendar integrations</p>
        <div className="grid grid-cols-2 gap-4">

          {/* Calendly / Cal.com — active */}
          <div className="bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#F0F4FF] border border-indigo-100 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#4F46E5] flex items-center justify-center shrink-0">
                <CalendarCheck size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">Calendly / Cal.com</p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">When a call is booked via your booking link, it automatically appears in your calendar and moves the deal to Discovery Call Booked.</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#4F46E5] bg-white rounded-full px-2.5 py-1 border border-indigo-100">
                <Zap size={10} />
                Auto-sync active
              </span>
              <span className="text-xs text-[#6B7280]">Configure in Integrations</span>
            </div>
          </div>

          {/* Gmail + Outlook — coming soon */}
          <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-4 bg-gray-50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-[#9CA3AF]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-[#9CA3AF]">Gmail + Outlook sync</p>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-200 text-[#9CA3AF]">Coming soon</span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">Two-way sync with your Google or Microsoft calendar. Events created in either direction stay in sync automatically.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl mt-4">
        <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
        <p className="text-xs font-medium text-[#374151] leading-relaxed">Your calendar shows all discovery calls booked through Leadomation sequences, plus any meetings you add manually. Calls booked via your Calendly or Cal.com link will appear here automatically once a lead books.</p>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddEventModal
          defaultDate={selectedDate}
          defaultStartTime={selectedStartTime}
          defaultEndTime={selectedEndTime}
          onClose={() => {
            setShowAddModal(false);
            setSelectedDate(null);
            setSelectedStartTime(undefined);
            setSelectedEndTime(undefined);
          }}
          onSave={addEvent}
        />
      )}

      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={updateEvent}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
