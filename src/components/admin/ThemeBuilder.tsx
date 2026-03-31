'use client';

import { useState, useCallback } from 'react';
import { useStore, themePresets, type HomeSection, type SectionType } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Star,
  Sparkles,
  Package,
  Image,
  MessageSquare,
  Mail,
  Palette,
  Layers,
  Pencil,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

const sectionTypeConfig: Record<SectionType, { label: string; icon: typeof Star; description: string }> = {
  hero: { label: 'Hero Banner', icon: Star, description: 'Full-width hero with CTA' },
  collections: { label: 'Collections', icon: Layers, description: 'Shop by collection grid' },
  featured_products: { label: 'Featured Products', icon: Sparkles, description: 'Curated best sellers' },
  new_arrivals: { label: 'New Arrivals', icon: Package, description: 'Latest product drops' },
  banner: { label: 'Promo Banner', icon: Image, description: 'Mid-page promotional banner' },
  testimonials: { label: 'Testimonials', icon: MessageSquare, description: 'Customer reviews' },
  newsletter: { label: 'Newsletter', icon: Mail, description: 'Email signup form' },
};

interface SortableSectionProps {
  section: HomeSection;
  onToggle: (id: string) => void;
  onEdit: (section: HomeSection) => void;
}

function SortableSection({ section, onToggle, onEdit }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const config = sectionTypeConfig[section.type];
  const Icon = config.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        section.enabled
          ? 'border-gray-200 bg-white hover:bg-gray-50'
          : 'border-gray-100 bg-gray-50 opacity-60'
      }`}
    >
      <button
        className="size-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer touch-none shrink-0"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${section.enabled ? 'bg-blue-50' : 'bg-gray-200'}`}>
        <Icon className={`size-4 ${section.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{section.title || config.label}</p>
        <p className="text-xs text-gray-400 truncate">{config.description}</p>
      </div>

      <Badge variant={section.enabled ? 'default' : 'secondary'} className={`text-[10px] shrink-0 ${section.enabled ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-500'}`}>
        {config.label}
      </Badge>

      <Switch
        checked={section.enabled}
        onCheckedChange={() => onToggle(section.id)}
        className="shrink-0"
      />

      <Button
        variant="ghost"
        size="icon"
        className="size-8 hover:bg-blue-50 hover:text-blue-600 cursor-pointer shrink-0"
        onClick={() => onEdit(section)}
      >
        <Pencil className="size-3.5" />
      </Button>
    </div>
  );
}

export default function ThemeBuilder() {
  const homeSections = useStore((s) => s.homeSections);
  const reorderSections = useStore((s) => s.reorderSections);
  const toggleSection = useStore((s) => s.toggleSection);
  const updateSection = useStore((s) => s.updateSection);
  const activeTheme = useStore((s) => s.activeTheme);
  const setActiveTheme = useStore((s) => s.setActiveTheme);

  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editConfig, setEditConfig] = useState<Record<string, string>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        reorderSections(active.id as string, over.id as string);
      }
    },
    [reorderSections]
  );

  const handleEdit = (section: HomeSection) => {
    setEditingSection(section);
    setEditTitle(section.title);
    setEditSubtitle(section.subtitle || '');
    setEditConfig(
      Object.fromEntries(
        Object.entries(section.config).map(([k, v]) => [k, String(v)])
      )
    );
  };

  const handleSaveEdit = () => {
    if (!editingSection) return;
    const configObj: Record<string, string | number | boolean> = {};
    for (const [key, val] of Object.entries(editConfig)) {
      const origVal = editingSection.config[key];
      if (typeof origVal === 'number') {
        configObj[key] = parseFloat(val) || 0;
      } else if (typeof origVal === 'boolean') {
        configObj[key] = val === 'true';
      } else {
        configObj[key] = val;
      }
    }
    updateSection(editingSection.id, {
      title: editTitle,
      subtitle: editSubtitle || undefined,
      config: configObj,
    });
    setEditingSection(null);
  };

  const enabledCount = homeSections.filter((s) => s.enabled).length;
  const disabledCount = homeSections.filter((s) => !s.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Theme Builder</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Customize your homepage sections and choose a theme
        </p>
      </div>

      {/* Theme Presets */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-center gap-2">
            <Palette className="size-5 text-blue-600" />
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Theme Presets</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Select a theme for your storefront
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {themePresets.map((preset) => {
              const isActive = activeTheme.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActiveTheme(preset.id)}
                  className={`group relative rounded-xl border-2 p-3 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-100'
                      : 'border-gray-200/60 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 size-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="size-3 text-white" />
                    </div>
                  )}
                  {/* Color Swatch */}
                  <div className="flex gap-1 mb-2.5">
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: preset.colors.background }} />
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: preset.colors.primary }} />
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: preset.colors.accent }} />
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: preset.colors.cta }} />
                  </div>
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                    {preset.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Sections */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Available Sections</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Drag to reorder in the active list
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-2">
              {(Object.entries(sectionTypeConfig) as [SectionType, typeof sectionTypeConfig[SectionType]][]).map(
                ([type, config]) => {
                  const Icon = config.icon;
                  const isUsed = homeSections.some((s) => s.type === type);
                  return (
                    <div
                      key={type}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <div className="size-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                        <Icon className="size-3.5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700">{config.label}</p>
                        <p className="text-[10px] text-gray-400 truncate">{config.description}</p>
                      </div>
                      {isUsed && (
                        <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 shrink-0">
                          Active
                        </Badge>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Sections - Drag and Drop */}
        <Card className="lg:col-span-2 border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">Homepage Sections</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  {enabledCount} active, {disabledCount} disabled — drag to reorder
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={homeSections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {homeSections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      onToggle={toggleSection}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>

      {/* Edit Section Dialog */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Configure &quot;{editingSection?.title}&quot; section settings
            </DialogDescription>
          </DialogHeader>
          {editingSection && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="Optional subtitle"
                />
              </div>
              {Object.keys(editConfig).length > 0 && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Configuration</p>
                  {Object.entries(editConfig).map(([key, value]) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-xs text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </Label>
                      <Input
                        value={value}
                        onChange={(e) =>
                          setEditConfig({ ...editConfig, [key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSection(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
