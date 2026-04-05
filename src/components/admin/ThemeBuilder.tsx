'use client';

import { useState, useCallback } from 'react';
import { useStore, sectionTypeConfig, type HomeSection, type SectionType, type SiteConfig } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  Plus,
  Trash2,
  Settings,
  Home,
  Type,
  Layout,
  Megaphone,
  Store,
  Globe,
  Link2,
  Save,
  RotateCcw,
} from 'lucide-react';

interface SortableSectionProps {
  section: HomeSection;
  onToggle: (id: string) => void;
  onEdit: (section: HomeSection) => void;
  onDelete: (id: string) => void;
}

function SortableSection({ section, onToggle, onEdit, onDelete }: SortableSectionProps) {
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
  const Icon = Layers;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
        section.enabled
          ? 'border-gray-200 bg-white hover:shadow-md'
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

      <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${section.enabled ? 'bg-amber-50' : 'bg-gray-200'}`}>
        <Icon className={`size-5 ${section.enabled ? 'text-amber-600' : 'text-gray-400'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{section.title || config?.label}</p>
        <p className="text-xs text-gray-500 truncate">{config?.description}</p>
      </div>

      <Badge variant={section.enabled ? 'default' : 'secondary'} className={`text-[10px] shrink-0 ${section.enabled ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : 'bg-gray-100 text-gray-500'}`}>
        {config?.label}
      </Badge>

      <Switch
        checked={section.enabled}
        onCheckedChange={() => onToggle(section.id)}
        className="shrink-0"
      />

      <Button
        variant="ghost"
        size="icon"
        className="size-8 hover:bg-amber-50 hover:text-amber-600 cursor-pointer shrink-0"
        onClick={() => onEdit(section)}
      >
        <Settings className="size-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
        onClick={() => onDelete(section.id)}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

export default function ThemeBuilder() {
  const homeSections = useStore((s) => s.homeSections);
  const reorderSections = useStore((s) => s.reorderSections);
  const toggleSection = useStore((s) => s.toggleSection);
  const updateSection = useStore((s) => s.updateSection);
  const addSection = useStore((s) => s.addSection);
  const deleteSection = useStore((s) => s.deleteSection);
  const siteConfig = useStore((s) => s.siteConfig);
  const updateSiteConfig = useStore((s) => s.updateSiteConfig);
  const activeTheme = useStore((s) => s.activeTheme);
  const setActiveTheme = useStore((s) => s.setActiveTheme);

  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editConfig, setEditConfig] = useState<Record<string, string>>({});
  const [editSlides, setEditSlides] = useState<Array<{ image: string; overline: string; title: string; subtitle: string; cta: string; link: string }>>([]);
  const [editTestimonials, setEditTestimonials] = useState<Array<{ name: string; location: string; avatar: string; rating: number; text: string; product: string; verified: boolean }>>([]);
  const [editCollections, setEditCollections] = useState<Array<{ name: string; slug: string; image: string }>>([]);
  const [activeTab, setActiveTab] = useState('sections');

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
    
    // Parse slides for hero section
    if (section.type === 'hero' && section.config.slides) {
      try {
        setEditSlides(JSON.parse(section.config.slides as string));
      } catch {
        setEditSlides([]);
      }
    } else {
      setEditSlides([]);
    }
    
    // Parse testimonials for testimonials section
    if (section.type === 'testimonials' && section.config.testimonials) {
      try {
        setEditTestimonials(JSON.parse(section.config.testimonials as string));
      } catch {
        setEditTestimonials([]);
      }
    } else {
      setEditTestimonials([]);
    }
    
    // Parse collections for collections section
    if (section.type === 'collections' && section.config.collections) {
      try {
        setEditCollections(JSON.parse(section.config.collections as string));
      } catch {
        setEditCollections([]);
      }
    } else {
      setEditCollections([]);
    }
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
    
    // Save slides for hero section
    if (editingSection.type === 'hero' && editSlides.length > 0) {
      configObj.slides = JSON.stringify(editSlides);
    }
    
    // Save testimonials for testimonials section
    if (editingSection.type === 'testimonials' && editTestimonials.length > 0) {
      configObj.testimonials = JSON.stringify(editTestimonials);
    }
    
    // Save collections for collections section
    if (editingSection.type === 'collections' && editCollections.length > 0) {
      configObj.collections = JSON.stringify(editCollections);
    }
    
    updateSection(editingSection.id, {
      title: editTitle,
      subtitle: editSubtitle || undefined,
      config: configObj,
    });
    setEditingSection(null);
  };

  const handleAddSection = (type: SectionType) => {
    addSection(type);
  };

  const enabledCount = homeSections.filter((s) => s.enabled).length;
  const disabledCount = homeSections.filter((s) => !s.enabled).length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border">
          <TabsTrigger value="sections" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <Layers className="size-4 mr-2" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="header" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <Home className="size-4 mr-2" />
            Header
          </TabsTrigger>
          <TabsTrigger value="footer" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <Home className="size-4 mr-2" />
            Footer
          </TabsTrigger>
          <TabsTrigger value="colors" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <Palette className="size-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <Type className="size-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <Layout className="size-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="announcement" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <Megaphone className="size-4 mr-2" />
            Announcement
          </TabsTrigger>
        </TabsList>

        {/* SECTIONS TAB */}
        <TabsContent value="sections" className="space-y-6 mt-6">
          {/* Add Section */}
          <Card className="border border-gray-200/60 shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base font-semibold text-gray-900">Add New Section</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Click to add a new section to your homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {(Object.entries(sectionTypeConfig) as [SectionType, typeof sectionTypeConfig[SectionType]][]).map(
                  ([type, config]) => {
                    const Icon = Star;
                    const isUsed = homeSections.some((s) => s.type === type);
                    return (
                      <button
                        key={type}
                        onClick={() => handleAddSection(type)}
                        disabled={isUsed}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          isUsed
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-md cursor-pointer'
                        }`}
                      >
                        {isUsed && (
                          <Badge variant="secondary" className="absolute top-2 right-2 text-[8px]">
                            Added
                          </Badge>
                        )}
                        <div className="size-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                          <Icon className="size-5 text-amber-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{config.label}</p>
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{config.description}</p>
                      </button>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Sections - Drag and Drop */}
          <Card className="border border-gray-200/60 shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">Homepage Sections</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    {enabledCount} active, {disabledCount} disabled — drag to reorder • Click settings to edit • Click trash to delete
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {homeSections.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Layers className="size-12 mx-auto mb-3 text-gray-300" />
                  <p>No sections added yet. Add sections from the panel above.</p>
                </div>
              ) : (
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
                          onDelete={deleteSection}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* HEADER TAB */}
        <TabsContent value="header" className="space-y-6 mt-6">
          <Card className="border border-gray-200/60 shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base font-semibold text-gray-900">Header Settings</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Customize your store header
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Transparent Header</Label>
                  <Switch
                    checked={siteConfig.headerTransparent}
                    onCheckedChange={(checked) => updateSiteConfig({ headerTransparent: checked })}
                  />
                  <p className="text-xs text-gray-500">Header appears transparent on hero</p>
                </div>
                <div className="space-y-3">
                  <Label>Sticky Header</Label>
                  <Switch
                    checked={siteConfig.headerSticky}
                    onCheckedChange={(checked) => updateSiteConfig({ headerSticky: checked })}
                  />
                  <p className="text-xs text-gray-500">Header stays visible when scrolling</p>
                </div>
                <div className="space-y-3">
                  <Label>Show Search</Label>
                  <Switch
                    checked={siteConfig.headerShowSearch}
                    onCheckedChange={(checked) => updateSiteConfig({ headerShowSearch: checked })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Show Wishlist</Label>
                  <Switch
                    checked={siteConfig.headerShowWishlist}
                    onCheckedChange={(checked) => updateSiteConfig({ headerShowWishlist: checked })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Show Account</Label>
                  <Switch
                    checked={siteConfig.headerShowAccount}
                    onCheckedChange={(checked) => updateSiteConfig({ headerShowAccount: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Navigation Menu</Label>
                {siteConfig.headerMenu.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newMenu = [...siteConfig.headerMenu];
                        newMenu[index].label = e.target.value;
                        updateSiteConfig({ headerMenu: newMenu });
                      }}
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      value={item.link}
                      onChange={(e) => {
                        const newMenu = [...siteConfig.headerMenu];
                        newMenu[index].link = e.target.value;
                        updateSiteConfig({ headerMenu: newMenu });
                      }}
                      placeholder="/link"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newMenu = siteConfig.headerMenu.filter((_, i) => i !== index);
                        updateSiteConfig({ headerMenu: newMenu });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateSiteConfig({ headerMenu: [...siteConfig.headerMenu, { label: '', link: '' }] });
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Menu Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOOTER TAB */}
        <TabsContent value="footer" className="space-y-6 mt-6">
          <Card className="border border-gray-200/60 shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base font-semibold text-gray-900">Footer Settings</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Customize your store footer
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Show Newsletter</Label>
                  <Switch
                    checked={siteConfig.footerShowNewsletter}
                    onCheckedChange={(checked) => updateSiteConfig({ footerShowNewsletter: checked })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Show Social Links</Label>
                  <Switch
                    checked={siteConfig.footerShowSocial}
                    onCheckedChange={(checked) => updateSiteConfig({ footerShowSocial: checked })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Show Quick Links</Label>
                  <Switch
                    checked={siteConfig.footerShowLinks}
                    onCheckedChange={(checked) => updateSiteConfig({ footerShowLinks: checked })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Show Contact Info</Label>
                  <Switch
                    checked={siteConfig.footerShowContact}
                    onCheckedChange={(checked) => updateSiteConfig({ footerShowContact: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Copyright Text</Label>
                <Input
                  value={siteConfig.footerCopyright}
                  onChange={(e) => updateSiteConfig({ footerCopyright: e.target.value })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Quick Links</Label>
                {siteConfig.footerQuickLinks.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...siteConfig.footerQuickLinks];
                        newLinks[index].label = e.target.value;
                        updateSiteConfig({ footerQuickLinks: newLinks });
                      }}
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...siteConfig.footerQuickLinks];
                        newLinks[index].url = e.target.value;
                        updateSiteConfig({ footerQuickLinks: newLinks });
                      }}
                      placeholder="/link"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newLinks = siteConfig.footerQuickLinks.filter((_, i) => i !== index);
                        updateSiteConfig({ footerQuickLinks: newLinks });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateSiteConfig({ footerQuickLinks: [...siteConfig.footerQuickLinks, { label: '', url: '' }] });
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COLORS TAB */}
        <TabsContent value="colors" className="space-y-6 mt-6">
          <Card className="border border-gray-200/60 shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base font-semibold text-gray-900">Color Scheme</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Customize your store colors
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs">Primary</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.primary}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, primary: e.target.value } })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={siteConfig.colors.primary}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, primary: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Accent</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.accent}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, accent: e.target.value } })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={siteConfig.colors.accent}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, accent: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Background</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.background}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, background: e.target.value } })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={siteConfig.colors.background}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, background: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Text</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.text}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, text: e.target.value } })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={siteConfig.colors.text}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, text: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Text Muted</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.textMuted}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, textMuted: e.target.value } })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={siteConfig.colors.textMuted}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, textMuted: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Border</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.border}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, border: e.target.value } })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={siteConfig.colors.border}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, border: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Success</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.success}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, success: e.target.value } })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={siteConfig.colors.success}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, success: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Error</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.error}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, error: e.target.value } })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={siteConfig.colors.error}
                      onChange={(e) => updateSiteConfig({ colors: { ...siteConfig.colors, error: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TYPOGRAPHY TAB */}
        <TabsContent value="typography" className="space-y-6 mt-6">
          <Card className="border border-gray-200/60 shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base font-semibold text-gray-900">Typography</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Customize fonts and text styles
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Input
                    value={siteConfig.typography.headingFont}
                    onChange={(e) => updateSiteConfig({ typography: { ...siteConfig.typography, headingFont: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Input
                    value={siteConfig.typography.bodyFont}
                    onChange={(e) => updateSiteConfig({ typography: { ...siteConfig.typography, bodyFont: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heading Weight</Label>
                  <Input
                    value={siteConfig.typography.headingWeight}
                    onChange={(e) => updateSiteConfig({ typography: { ...siteConfig.typography, headingWeight: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Body Weight</Label>
                  <Input
                    value={siteConfig.typography.bodyWeight}
                    onChange={(e) => updateSiteConfig({ typography: { ...siteConfig.typography, bodyWeight: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heading Case</Label>
                  <Input
                    value={siteConfig.typography.headingCase}
                    onChange={(e) => updateSiteConfig({ typography: { ...siteConfig.typography, headingCase: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base Font Size</Label>
                  <Input
                    value={siteConfig.typography.baseFontSize}
                    onChange={(e) => updateSiteConfig({ typography: { ...siteConfig.typography, baseFontSize: e.target.value } })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LAYOUT TAB */}
        <TabsContent value="layout" className="space-y-6 mt-6">
          <Card className="border border-gray-200/60 shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base font-semibold text-gray-900">Layout Settings</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Customize your store layout
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Container Max Width</Label>
                  <Input
                    value={siteConfig.layout.containerMaxWidth}
                    onChange={(e) => updateSiteConfig({ layout: { ...siteConfig.layout, containerMaxWidth: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Grid Columns</Label>
                  <Input
                    type="number"
                    value={siteConfig.layout.productGridColumns}
                    onChange={(e) => updateSiteConfig({ layout: { ...siteConfig.layout, productGridColumns: parseInt(e.target.value) || 4 } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Products Per Page</Label>
                  <Input
                    type="number"
                    value={siteConfig.layout.productsPerPage}
                    onChange={(e) => updateSiteConfig({ layout: { ...siteConfig.layout, productsPerPage: parseInt(e.target.value) || 12 } })}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Shipping Info</Label>
                  <Textarea
                    value={siteConfig.shippingInfo}
                    onChange={(e) => updateSiteConfig({ shippingInfo: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Returns Info</Label>
                  <Textarea
                    value={siteConfig.returnsInfo}
                    onChange={(e) => updateSiteConfig({ returnsInfo: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANNOUNCEMENT TAB */}
        <TabsContent value="announcement" className="space-y-6 mt-6">
          <Card className="border border-gray-200/60 shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-base font-semibold text-gray-900">Announcement Bar</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Configure the top announcement bar
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-6">
              <div className="space-y-3">
                <Label>Enable Announcement Bar</Label>
                <Switch
                  checked={siteConfig.announcementEnabled}
                  onCheckedChange={(checked) => updateSiteConfig({ announcementEnabled: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Announcement Text</Label>
                  <Input
                    value={siteConfig.announcementText}
                    onChange={(e) => updateSiteConfig({ announcementText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link (optional)</Label>
                  <Input
                    value={siteConfig.announcementLink}
                    onChange={(e) => updateSiteConfig({ announcementLink: e.target.value })}
                    placeholder="/shop"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={siteConfig.announcementBgColor}
                        onChange={(e) => updateSiteConfig({ announcementBgColor: e.target.value })}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={siteConfig.announcementBgColor}
                        onChange={(e) => updateSiteConfig({ announcementBgColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={siteConfig.announcementTextColor}
                        onChange={(e) => updateSiteConfig({ announcementTextColor: e.target.value })}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={siteConfig.announcementTextColor}
                        onChange={(e) => updateSiteConfig({ announcementTextColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Section Dialog */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Configure "{editingSection?.title}" section settings
            </DialogDescription>
          </DialogHeader>
          {editingSection && (
            <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
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

              {/* Banner/Hero specific fields */}
              {(editingSection.type === 'banner' || editingSection.type === 'hero') && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Banner Settings</p>
                  
                  {editingSection.type === 'banner' && (
                    <>
                      <div className="space-y-2">
                        <Label>Desktop Image URL</Label>
                        <Input
                          value={editConfig.imageDesktop || ''}
                          onChange={(e) => setEditConfig({ ...editConfig, imageDesktop: e.target.value })}
                          placeholder="/images/banner/desktop.jpg"
                        />
                        <p className="text-[10px] text-gray-400">Recommended: 1920×800px (landscape, 2.4:1 ratio)</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Mobile Image URL</Label>
                        <Input
                          value={editConfig.imageMobile || ''}
                          onChange={(e) => setEditConfig({ ...editConfig, imageMobile: e.target.value })}
                          placeholder="/images/banner/mobile.jpg"
                        />
                        <p className="text-[10px] text-gray-400">Recommended: 750×1334px (portrait, 9:16 ratio)</p>
                      </div>
                    </>
                  )}

                  {editingSection.type === 'hero' && (
                    <>
                      <div className="space-y-2">
                        <Label>Background Image URL</Label>
                        <Input
                          value={editConfig.image || ''}
                          onChange={(e) => setEditConfig({ ...editConfig, image: e.target.value })}
                          placeholder="/images/hero/hero-1.png or https://..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                          value={editConfig.buttonText || ''}
                          onChange={(e) => setEditConfig({ ...editConfig, buttonText: e.target.value })}
                          placeholder="Shop Now"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Button Link</Label>
                        <Input
                          value={editConfig.buttonLink || ''}
                          onChange={(e) => setEditConfig({ ...editConfig, buttonLink: e.target.value })}
                          placeholder="/shop"
                        />
                      </div>
                    </>
                  )}

                  {editingSection.type === 'hero' && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label>Auto-play Slides</Label>
                        <Switch
                          checked={editConfig.autoplay === 'true'}
                          onCheckedChange={(checked) =>
                            setEditConfig({ ...editConfig, autoplay: String(checked) })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Slide Interval (seconds)</Label>
                        <Input
                          type="number"
                          value={editConfig.interval || '7'}
                          onChange={(e) => setEditConfig({ ...editConfig, interval: e.target.value })}
                        />
                      </div>

                      <Separator />
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Slides ({editSlides.length})</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditSlides([...editSlides, { image: '', overline: '', title: '', subtitle: '', cta: 'Shop Now', link: '/shop' }])}
                        >
                          <Plus className="size-3 mr-1" />
                          Add Slide
                        </Button>
                      </div>
                      
                      {editSlides.map((slide, index) => (
                        <div key={index} className="space-y-3 p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">Slide {index + 1}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 hover:bg-red-50 hover:text-red-600"
                              onClick={() => {
                                const newSlides = editSlides.filter((_, i) => i !== index);
                                setEditSlides(newSlides);
                              }}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] text-gray-500">Image URL</Label>
                            <Input
                              value={slide.image}
                              onChange={(e) => {
                                const newSlides = [...editSlides];
                                newSlides[index].image = e.target.value;
                                setEditSlides(newSlides);
                              }}
                              placeholder="/images/hero/hero-1.png"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] text-gray-500">Overline</Label>
                            <Input
                              value={slide.overline}
                              onChange={(e) => {
                                const newSlides = [...editSlides];
                                newSlides[index].overline = e.target.value;
                                setEditSlides(newSlides);
                              }}
                              placeholder="NEW COLLECTION"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] text-gray-500">Title</Label>
                            <Input
                              value={slide.title}
                              onChange={(e) => {
                                const newSlides = [...editSlides];
                                newSlides[index].title = e.target.value;
                                setEditSlides(newSlides);
                              }}
                              placeholder="Eid Al-Fitr Edit"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] text-gray-500">Subtitle</Label>
                            <Input
                              value={slide.subtitle}
                              onChange={(e) => {
                                const newSlides = [...editSlides];
                                newSlides[index].subtitle = e.target.value;
                                setEditSlides(newSlides);
                              }}
                              placeholder="Discover the new collection"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label className="text-[10px] text-gray-500">Button Text</Label>
                              <Input
                                value={slide.cta}
                                onChange={(e) => {
                                  const newSlides = [...editSlides];
                                  newSlides[index].cta = e.target.value;
                                  setEditSlides(newSlides);
                                }}
                                placeholder="Shop Now"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] text-gray-500">Button Link</Label>
                              <Input
                                value={slide.link}
                                onChange={(e) => {
                                  const newSlides = [...editSlides];
                                  newSlides[index].link = e.target.value;
                                  setEditSlides(newSlides);
                                }}
                                placeholder="/shop"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {/* Testimonials specific fields */}
              {editingSection.type === 'testimonials' && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Testimonials ({editTestimonials.length})</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditTestimonials([...editTestimonials, { name: '', location: '', avatar: '', rating: 5, text: '', product: '', verified: true }])}
                    >
                      <Plus className="size-3 mr-1" />
                      Add Testimonial
                    </Button>
                  </div>
                  
                  {editTestimonials.map((t, index) => (
                    <div key={index} className="space-y-3 p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Testimonial {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 hover:bg-red-50 hover:text-red-600"
                          onClick={() => {
                            const newItems = editTestimonials.filter((_, i) => i !== index);
                            setEditTestimonials(newItems);
                          }}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500">Name</Label>
                        <Input
                          value={t.name}
                          onChange={(e) => {
                            const newItems = [...editTestimonials];
                            newItems[index].name = e.target.value;
                            setEditTestimonials(newItems);
                          }}
                          placeholder="Nour E."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500">Location</Label>
                        <Input
                          value={t.location}
                          onChange={(e) => {
                            const newItems = [...editTestimonials];
                            newItems[index].location = e.target.value;
                            setEditTestimonials(newItems);
                          }}
                          placeholder="Cairo, Egypt"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500">Avatar Image URL</Label>
                        <Input
                          value={t.avatar}
                          onChange={(e) => {
                            const newItems = [...editTestimonials];
                            newItems[index].avatar = e.target.value;
                            setEditTestimonials(newItems);
                          }}
                          placeholder="https://... or leave empty for initials"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500">Review Text</Label>
                        <Textarea
                          value={t.text}
                          onChange={(e) => {
                            const newItems = [...editTestimonials];
                            newItems[index].text = e.target.value;
                            setEditTestimonials(newItems);
                          }}
                          placeholder="The quality is amazing..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500">Product Name</Label>
                        <Input
                          value={t.product}
                          onChange={(e) => {
                            const newItems = [...editTestimonials];
                            newItems[index].product = e.target.value;
                            setEditTestimonials(newItems);
                          }}
                          placeholder="Aura Oversized Abaya Set"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-gray-500">Rating (1-5)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={t.rating}
                            onChange={(e) => {
                              const newItems = [...editTestimonials];
                              newItems[index].rating = parseInt(e.target.value) || 5;
                              setEditTestimonials(newItems);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-6">
                          <Label className="text-[10px] text-gray-500">Verified</Label>
                          <Switch
                            checked={t.verified}
                            onCheckedChange={(checked) => {
                              const newItems = [...editTestimonials];
                              newItems[index].verified = checked;
                              setEditTestimonials(newItems);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Collections specific fields */}
              {editingSection.type === 'collections' && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Collections ({editCollections.length})</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditCollections([...editCollections, { name: '', slug: '', image: '' }])}
                    >
                      <Plus className="size-3 mr-1" />
                      Add Collection
                    </Button>
                  </div>
                  
                  {editCollections.map((col, index) => (
                    <div key={index} className="space-y-3 p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Collection {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 hover:bg-red-50 hover:text-red-600"
                          onClick={() => {
                            const newItems = editCollections.filter((_, i) => i !== index);
                            setEditCollections(newItems);
                          }}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500">Name</Label>
                        <Input
                          value={col.name}
                          onChange={(e) => {
                            const newItems = [...editCollections];
                            newItems[index].name = e.target.value;
                            setEditCollections(newItems);
                          }}
                          placeholder="Abayas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500">Slug (Shopify collection handle)</Label>
                        <Input
                          value={col.slug}
                          onChange={(e) => {
                            const newItems = [...editCollections];
                            newItems[index].slug = e.target.value.toLowerCase().replace(/\s+/g, '-');
                            setEditCollections(newItems);
                          }}
                          placeholder="abayas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500">Image URL</Label>
                        <Input
                          value={col.image}
                          onChange={(e) => {
                            const newItems = [...editCollections];
                            newItems[index].image = e.target.value;
                            setEditCollections(newItems);
                          }}
                          placeholder="/images/categories/cat-everyday.png"
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Collection Products specific fields */}
              {editingSection.type === 'collection_products' && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Collection Products</p>
                  <div className="space-y-2">
                    <Label>Collection Handle (from Shopify)</Label>
                    <Input
                      value={editConfig.collection || ''}
                      onChange={(e) => setEditConfig({ ...editConfig, collection: e.target.value })}
                      placeholder="abayas"
                    />
                    <p className="text-[10px] text-gray-400">The handle of the Shopify collection to show products from</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Products</Label>
                    <Input
                      type="number"
                      value={editConfig.count || '8'}
                      onChange={(e) => setEditConfig({ ...editConfig, count: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Generic config for other section types */}
              {editingSection.type !== 'banner' && editingSection.type !== 'hero' && Object.keys(editConfig).length > 0 && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Configuration</p>
                  {Object.entries(editConfig).map(([key, value]) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-xs text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </Label>
                      {typeof editingSection.config[key] === 'boolean' ? (
                        <Switch
                          checked={value === 'true'}
                          onCheckedChange={(checked) =>
                            setEditConfig({ ...editConfig, [key]: String(checked) })
                          }
                        />
                      ) : (
                        <Input
                          value={value}
                          onChange={(e) =>
                            setEditConfig({ ...editConfig, [key]: e.target.value })
                          }
                        />
                      )}
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
              className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
            >
              <Save className="size-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
