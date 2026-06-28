"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Grid3x3, List, Search, Filter, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color: string;
  category?: string;
  tags?: string[];
}

export interface EventManagerProps {
  events?: CalendarEvent[];
  onEventCreate?: (event: Omit<CalendarEvent, "id">) => void;
  onEventUpdate?: (id: string, event: Partial<CalendarEvent>) => void;
  onEventDelete?: (id: string) => void;
  categories?: string[];
  colors?: { name: string; value: string; bg: string; dot: string }[];
  defaultView?: "month" | "week" | "day" | "list";
  className?: string;
  availableTags?: string[];
  compact?: boolean;
}

const CEFI_COLORS = [
  { name: "Violeta", value: "violet", bg: "bg-violet-500", dot: "#7C3AED" },
  { name: "Rosa", value: "pink", bg: "bg-pink-500", dot: "#EC4899" },
  { name: "Azul", value: "blue", bg: "bg-blue-500", dot: "#3B82F6" },
  { name: "Esmeralda", value: "emerald", bg: "bg-emerald-500", dot: "#10B981" },
  { name: "Ámbar", value: "amber", bg: "bg-amber-500", dot: "#F59E0B" },
  { name: "Rosa oscuro", value: "rose", bg: "bg-rose-500", dot: "#F43F5E" },
];

export function EventManager({
  events: initialEvents = [],
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  categories = ["Matemáticas", "Español", "Biología", "Historia", "Química", "Física"],
  colors = CEFI_COLORS,
  defaultView = "month",
  className,
  availableTags = ["Importante", "Urgente", "Repaso", "Práctica", "Lectura", "Simulacro"],
  compact = false,
}: EventManagerProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day" | "list">(defaultView);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    color: colors[0].value,
    category: categories[0],
    tags: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = event.title.toLowerCase().includes(q) ||
          event.description?.toLowerCase().includes(q) ||
          event.category?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedColors.length > 0 && !selectedColors.includes(event.color)) return false;
      if (selectedTags.length > 0 && !event.tags?.some(t => selectedTags.includes(t))) return false;
      if (selectedCategories.length > 0 && event.category && !selectedCategories.includes(event.category)) return false;
      return true;
    });
  }, [events, searchQuery, selectedColors, selectedTags, selectedCategories]);

  const hasActiveFilters = selectedColors.length > 0 || selectedTags.length > 0 || selectedCategories.length > 0;

  const handleCreateEvent = useCallback(() => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;
    const event: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      description: newEvent.description,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      color: newEvent.color || colors[0].value,
      category: newEvent.category,
      tags: newEvent.tags || [],
    };
    setEvents(prev => [...prev, event]);
    onEventCreate?.(event);
    setIsDialogOpen(false);
    setIsCreating(false);
    setNewEvent({ title: "", description: "", color: colors[0].value, category: categories[0], tags: [] });
  }, [newEvent, colors, categories, onEventCreate]);

  const handleUpdateEvent = useCallback(() => {
    if (!selectedEvent) return;
    setEvents(prev => prev.map(e => e.id === selectedEvent.id ? selectedEvent : e));
    onEventUpdate?.(selectedEvent.id, selectedEvent);
    setIsDialogOpen(false);
    setSelectedEvent(null);
  }, [selectedEvent, onEventUpdate]);

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    onEventDelete?.(id);
    setIsDialogOpen(false);
    setSelectedEvent(null);
  }, [onEventDelete]);

  const handleDragStart = useCallback((event: CalendarEvent) => setDraggedEvent(event), []);
  const handleDragEnd = useCallback(() => setDraggedEvent(null), []);

  const handleDrop = useCallback((date: Date, hour?: number) => {
    if (!draggedEvent) return;
    const duration = draggedEvent.endTime.getTime() - draggedEvent.startTime.getTime();
    const newStartTime = new Date(date);
    if (hour !== undefined) newStartTime.setHours(hour, 0, 0, 0);
    const newEndTime = new Date(newStartTime.getTime() + duration);
    const updated = { ...draggedEvent, startTime: newStartTime, endTime: newEndTime };
    setEvents(prev => prev.map(e => e.id === draggedEvent.id ? updated : e));
    onEventUpdate?.(draggedEvent.id, updated);
    setDraggedEvent(null);
  }, [draggedEvent, onEventUpdate]);

  const navigateDate = useCallback((direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (view === "month") d.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      else if (view === "week") d.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      else if (view === "day") d.setDate(prev.getDate() + (direction === "next" ? 1 : -1));
      return d;
    });
  }, [view]);

  const getColorMeta = useCallback((colorValue: string) => {
    return colors.find(c => c.value === colorValue) || colors[0];
  }, [colors]);

  const toggleTag = (tag: string, creating: boolean) => {
    if (creating) {
      setNewEvent(prev => ({ ...prev, tags: prev.tags?.includes(tag) ? prev.tags.filter(t => t !== tag) : [...(prev.tags || []), tag] }));
    } else {
      setSelectedEvent(prev => prev ? { ...prev, tags: prev.tags?.includes(tag) ? prev.tags.filter(t => t !== tag) : [...(prev.tags || []), tag] } : null);
    }
  };

  const viewLabel = {
    month: currentDate.toLocaleDateString("es-MX", { month: "long", year: "numeric" }),
    week: `Semana del ${currentDate.toLocaleDateString("es-MX", { month: "short", day: "numeric" })}`,
    day: currentDate.toLocaleDateString("es-MX", { weekday: "long", month: "long", day: "numeric" }),
    list: "Todos los eventos",
  }[view];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className={cn("font-black text-white", compact ? "text-base" : "text-xl")}>
            {viewLabel}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={() => navigateDate("prev")}
              className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())}
              className="px-2.5 h-7 text-xs font-semibold rounded-lg border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
              Hoy
            </button>
            <button onClick={() => navigateDate("next")}
              className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View switcher */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/5 border border-white/8">
            {(["month", "week", "day", "list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={cn("h-7 px-2.5 rounded-md text-xs font-semibold transition-all",
                  view === v ? "bg-violet-600 text-white shadow" : "text-white/40 hover:text-white/70")}>
                {v === "month" ? "Mes" : v === "week" ? "Semana" : v === "day" ? "Día" : "Lista"}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setIsCreating(true); setIsDialogOpen(true); }}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity shadow shadow-violet-900/30">
            <Plus className="h-3.5 w-3.5" />
            Nuevo
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      {!compact && (
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
            <input
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-9 pr-8 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold border border-white/10 bg-white/5 text-white/50 hover:bg-white/8 hover:text-white transition-all">
                <Filter className="h-3.5 w-3.5" />
                Filtros
                {hasActiveFilters && <span className="h-4 w-4 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center">{selectedColors.length + selectedTags.length + selectedCategories.length}</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Materias</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map(cat => (
                <DropdownMenuCheckboxItem key={cat} checked={selectedCategories.includes(cat)}
                  onCheckedChange={checked => setSelectedCategories(prev => checked ? [...prev, cat] : prev.filter(c => c !== cat))}>
                  {cat}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Color</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {colors.map(color => (
                <DropdownMenuCheckboxItem key={color.value} checked={selectedColors.includes(color.value)}
                  onCheckedChange={checked => setSelectedColors(prev => checked ? [...prev, color.value] : prev.filter(c => c !== color.value))}>
                  <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded", color.bg)} />
                    {color.name}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <button onClick={() => { setSelectedColors([]); setSelectedTags([]); setSelectedCategories([]); setSearchQuery(""); }}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white/40 hover:text-white/70 transition-colors">
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Calendar Views */}
      {view === "month" && (
        <MonthView currentDate={currentDate} events={filteredEvents}
          onEventClick={e => { setSelectedEvent(e); setIsDialogOpen(true); }}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrop={handleDrop}
          getColorMeta={getColorMeta} compact={compact} />
      )}
      {view === "week" && (
        <WeekView currentDate={currentDate} events={filteredEvents}
          onEventClick={e => { setSelectedEvent(e); setIsDialogOpen(true); }}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrop={handleDrop}
          getColorMeta={getColorMeta} compact={compact} />
      )}
      {view === "day" && (
        <DayView currentDate={currentDate} events={filteredEvents}
          onEventClick={e => { setSelectedEvent(e); setIsDialogOpen(true); }}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrop={handleDrop}
          getColorMeta={getColorMeta} />
      )}
      {view === "list" && (
        <ListView events={filteredEvents}
          onEventClick={e => { setSelectedEvent(e); setIsDialogOpen(true); }}
          getColorMeta={getColorMeta} />
      )}

      {/* Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={open => { setIsDialogOpen(open); if (!open) { setIsCreating(false); setSelectedEvent(null); } }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-[#0E0A18] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">{isCreating ? "Nuevo bloque de estudio" : "Editar bloque"}</DialogTitle>
            <DialogDescription className="text-white/40">
              {isCreating ? "Agrega un bloque de estudio a tu calendario" : "Modifica los detalles de este bloque"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Título</Label>
              <Input
                value={isCreating ? newEvent.title : selectedEvent?.title}
                onChange={e => isCreating
                  ? setNewEvent(prev => ({ ...prev, title: e.target.value }))
                  : setSelectedEvent(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder="Ej. Álgebra — Funciones cuadráticas"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Materia</Label>
              <Select
                value={isCreating ? newEvent.category : selectedEvent?.category}
                onValueChange={v => isCreating
                  ? setNewEvent(prev => ({ ...prev, category: v }))
                  : setSelectedEvent(prev => prev ? { ...prev, category: v } : null)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Selecciona materia" />
                </SelectTrigger>
                <SelectContent>
                  {["Matemáticas", "Español", "Biología", "Historia", "Química", "Física"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Inicio</Label>
                <Input type="datetime-local"
                  value={isCreating
                    ? newEvent.startTime ? new Date(newEvent.startTime.getTime() - newEvent.startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""
                    : selectedEvent ? new Date(selectedEvent.startTime.getTime() - selectedEvent.startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                  onChange={e => { const d = new Date(e.target.value); isCreating ? setNewEvent(prev => ({ ...prev, startTime: d })) : setSelectedEvent(prev => prev ? { ...prev, startTime: d } : null); }}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-violet-500/30" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Fin</Label>
                <Input type="datetime-local"
                  value={isCreating
                    ? newEvent.endTime ? new Date(newEvent.endTime.getTime() - newEvent.endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""
                    : selectedEvent ? new Date(selectedEvent.endTime.getTime() - selectedEvent.endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                  onChange={e => { const d = new Date(e.target.value); isCreating ? setNewEvent(prev => ({ ...prev, endTime: d })) : setSelectedEvent(prev => prev ? { ...prev, endTime: d } : null); }}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-violet-500/30" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colors.map(c => {
                  const cur = isCreating ? newEvent.color : selectedEvent?.color;
                  return (
                    <button key={c.value}
                      onClick={() => isCreating ? setNewEvent(prev => ({ ...prev, color: c.value })) : setSelectedEvent(prev => prev ? { ...prev, color: c.value } : null)}
                      className={cn("w-7 h-7 rounded-full transition-all", c.bg, cur === c.value ? "ring-2 ring-white ring-offset-2 ring-offset-[#0E0A18] scale-110" : "opacity-60 hover:opacity-100")}>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Notas</Label>
              <Textarea
                value={isCreating ? newEvent.description : selectedEvent?.description}
                onChange={e => isCreating ? setNewEvent(prev => ({ ...prev, description: e.target.value })) : setSelectedEvent(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Temas a cubrir, ejercicios pendientes..."
                rows={2}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-violet-500/30 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {!isCreating && (
              <button onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-all">
                Eliminar
              </button>
            )}
            <button onClick={() => { setIsDialogOpen(false); setIsCreating(false); setSelectedEvent(null); }}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 text-white/50 hover:bg-white/5 transition-all">
              Cancelar
            </button>
            <button onClick={isCreating ? handleCreateEvent : handleUpdateEvent}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-opacity">
              {isCreating ? "Agregar" : "Guardar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Event pill ──────────────────────────────────────────────────────────────
function EventPill({ event, onClick, onDragStart, onDragEnd, getColorMeta, variant = "compact" }: {
  event: CalendarEvent;
  onClick: (e: CalendarEvent) => void;
  onDragStart: (e: CalendarEvent) => void;
  onDragEnd: () => void;
  getColorMeta: (v: string) => { bg: string; dot: string };
  variant?: "compact" | "full";
}) {
  const meta = getColorMeta(event.color);
  const fmt = (d: Date) => d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

  if (variant === "full") {
    return (
      <div draggable onDragStart={() => onDragStart(event)} onDragEnd={onDragEnd} onClick={() => onClick(event)}
        className={cn("cursor-pointer rounded-lg px-2.5 py-1.5 text-white text-xs font-medium transition-all hover:opacity-90 hover:scale-[1.02]", meta.bg)}>
        <div className="font-semibold truncate">{event.title}</div>
        <div className="opacity-75 mt-0.5">{fmt(event.startTime)} – {fmt(event.endTime)}</div>
      </div>
    );
  }

  return (
    <div draggable onDragStart={() => onDragStart(event)} onDragEnd={onDragEnd} onClick={() => onClick(event)}
      className={cn("cursor-pointer rounded px-1.5 py-0.5 text-white text-[10px] font-medium transition-all hover:opacity-90 truncate", meta.bg)}>
      {event.title}
    </div>
  );
}

// ── Month View ──────────────────────────────────────────────────────────────
function MonthView({ currentDate, events, onEventClick, onDragStart, onDragEnd, onDrop, getColorMeta, compact }: {
  currentDate: Date; events: CalendarEvent[]; onEventClick: (e: CalendarEvent) => void;
  onDragStart: (e: CalendarEvent) => void; onDragEnd: () => void; onDrop: (d: Date) => void;
  getColorMeta: (v: string) => { bg: string; dot: string }; compact?: boolean;
}) {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const getDay = (date: Date) => events.filter(e => {
    const ed = new Date(e.startTime);
    return ed.getDate() === date.getDate() && ed.getMonth() === date.getMonth() && ed.getFullYear() === date.getFullYear();
  });

  const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-white/8">
        {DAY_LABELS.map(d => (
          <div key={d} className="p-2 text-center text-[10px] font-semibold text-white/30 uppercase tracking-wider border-r border-white/5 last:border-r-0">
            {compact ? d[0] : d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayEvents = getDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <div key={i}
              className={cn("border-b border-r border-white/5 last:border-r-0 p-1 transition-colors hover:bg-white/[0.03]", compact ? "min-h-14" : "min-h-20",
                !isCurrentMonth && "opacity-35")}
              onDragOver={e => e.preventDefault()} onDrop={() => onDrop(day)}>
              <div className={cn("mb-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-semibold",
                isToday ? "bg-violet-600 text-white" : "text-white/50")}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, compact ? 2 : 3).map(ev => (
                  <EventPill key={ev.id} event={ev} onClick={onEventClick} onDragStart={onDragStart} onDragEnd={onDragEnd} getColorMeta={getColorMeta} />
                ))}
                {dayEvents.length > (compact ? 2 : 3) && (
                  <div className="text-[9px] text-white/30 pl-0.5">+{dayEvents.length - (compact ? 2 : 3)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Week View ───────────────────────────────────────────────────────────────
function WeekView({ currentDate, events, onEventClick, onDragStart, onDragEnd, onDrop, getColorMeta, compact }: {
  currentDate: Date; events: CalendarEvent[]; onEventClick: (e: CalendarEvent) => void;
  onDragStart: (e: CalendarEvent) => void; onDragEnd: () => void; onDrop: (d: Date, h: number) => void;
  getColorMeta: (v: string) => { bg: string; dot: string }; compact?: boolean;
}) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const HOURS = compact
    ? [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
    : Array.from({ length: 24 }, (_, i) => i);

  const getEvt = (date: Date, hour: number) => events.filter(e => {
    const ed = new Date(e.startTime);
    return ed.getDate() === date.getDate() && ed.getMonth() === date.getMonth() && ed.getFullYear() === date.getFullYear() && ed.getHours() === hour;
  });

  const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-auto max-h-[480px]">
      <div className="grid border-b border-white/8 sticky top-0 bg-[#0E0A18] z-10" style={{ gridTemplateColumns: "3rem repeat(7, 1fr)" }}>
        <div className="border-r border-white/5" />
        {weekDays.map((d, i) => {
          const isToday = d.toDateString() === new Date().toDateString();
          return (
            <div key={i} className="p-1.5 text-center border-r border-white/5 last:border-r-0">
              <div className="text-[10px] text-white/30 font-semibold uppercase">{DAY_LABELS[d.getDay()]}</div>
              <div className={cn("mx-auto mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                isToday ? "bg-violet-600 text-white" : "text-white/60")}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {HOURS.map(hour => (
          <div key={hour} className="grid border-b border-white/5 last:border-b-0" style={{ gridTemplateColumns: "3rem repeat(7, 1fr)" }}>
            <div className="text-[10px] text-white/25 py-1 px-1 border-r border-white/5 text-right leading-none pt-1.5">
              {hour.toString().padStart(2, "0")}
            </div>
            {weekDays.map((day, di) => {
              const evts = getEvt(day, hour);
              return (
                <div key={di}
                  className="min-h-10 border-r border-white/5 last:border-r-0 p-0.5 hover:bg-white/[0.03] transition-colors space-y-0.5"
                  onDragOver={e => e.preventDefault()} onDrop={() => onDrop(day, hour)}>
                  {evts.map(ev => (
                    <EventPill key={ev.id} event={ev} onClick={onEventClick} onDragStart={onDragStart} onDragEnd={onDragEnd} getColorMeta={getColorMeta} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Day View ────────────────────────────────────────────────────────────────
function DayView({ currentDate, events, onEventClick, onDragStart, onDragEnd, onDrop, getColorMeta }: {
  currentDate: Date; events: CalendarEvent[]; onEventClick: (e: CalendarEvent) => void;
  onDragStart: (e: CalendarEvent) => void; onDragEnd: () => void; onDrop: (d: Date, h: number) => void;
  getColorMeta: (v: string) => { bg: string; dot: string };
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const getH = (h: number) => events.filter(e => {
    const ed = new Date(e.startTime);
    return ed.getDate() === currentDate.getDate() && ed.getMonth() === currentDate.getMonth() && ed.getFullYear() === currentDate.getFullYear() && ed.getHours() === h;
  });

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-auto max-h-[480px]">
      {hours.map(hour => {
        const evts = getH(hour);
        return (
          <div key={hour} className="flex border-b border-white/5 last:border-b-0"
            onDragOver={e => e.preventDefault()} onDrop={() => onDrop(currentDate, hour)}>
            <div className="w-12 shrink-0 text-[10px] text-white/25 border-r border-white/5 py-2 px-2 text-right">
              {hour.toString().padStart(2, "0")}:00
            </div>
            <div className="flex-1 min-h-12 p-1 hover:bg-white/[0.03] transition-colors space-y-1">
              {evts.map(ev => <EventPill key={ev.id} event={ev} onClick={onEventClick} onDragStart={onDragStart} onDragEnd={onDragEnd} getColorMeta={getColorMeta} variant="full" />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── List View ───────────────────────────────────────────────────────────────
function ListView({ events, onEventClick, getColorMeta }: {
  events: CalendarEvent[]; onEventClick: (e: CalendarEvent) => void;
  getColorMeta: (v: string) => { bg: string; dot: string };
}) {
  const sorted = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const grouped = sorted.reduce((acc, ev) => {
    const key = ev.startTime.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl bg-white/[0.03] border border-white/8 py-16 text-center text-sm text-white/30">
        Sin eventos. Agrega uno con el botón "Nuevo".
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, evts]) => (
        <div key={date}>
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 capitalize">{date}</p>
          <div className="space-y-2">
            {evts.map(ev => {
              const meta = getColorMeta(ev.color);
              const fmt = (d: Date) => d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
              return (
                <button key={ev.id} onClick={() => onEventClick(ev)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/6 hover:border-white/15 hover:bg-white/5 transition-all">
                  <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: meta.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/85 truncate">{ev.title}</p>
                    <p className="text-xs text-white/35">{fmt(ev.startTime)} – {fmt(ev.endTime)}</p>
                  </div>
                  {ev.category && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/8 text-white/40 border border-white/8 shrink-0">{ev.category}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
