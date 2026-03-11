import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableGalleryItem } from "./SortableGalleryItem";

interface NumberedGalleryProps {
  images: string[];
  projectTitle: string;
  projectId?: string;
  onImageClick: (index: number) => void;
  onOrderChange?: (newImages: string[]) => Promise<boolean> | void;
  onEditImage?: (image: string) => void;
  onAddImage?: (file: File) => Promise<void>;
  onRemoveImage?: (index: number) => void;
  isEditable?: boolean;
}

export const NumberedGallery = ({ images: externalImages, projectTitle, projectId, onImageClick, onOrderChange, onEditImage, onAddImage, onRemoveImage, isEditable = false }: NumberedGalleryProps) => {
  const { toast } = useToast();
  const addInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(externalImages);
  const [isCopied, setIsCopied] = useState(false);
  const [imageIds, setImageIds] = useState<string[]>(() => externalImages.map((img, i) => `${i}-${img}`));

  useEffect(() => { setImages(externalImages); setImageIds(externalImages.map((img, i) => `${i}-${img}`)); }, [externalImages]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }));

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = imageIds.indexOf(active.id as string);
    const newIndex = imageIds.indexOf(over.id as string);
    const newImages = arrayMove(images, oldIndex, newIndex);
    const newIds = arrayMove(imageIds, oldIndex, newIndex);
    setImages(newImages); setImageIds(newIds);
    const result = await onOrderChange?.(newImages);
    if (result === false) { setImages(externalImages); setImageIds(externalImages.map((img, i) => `${i}-${img}`)); }
  }, [images, imageIds, externalImages, onOrderChange]);

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(images, null, 2));
    setIsCopied(true);
    toast({ title: "Configuration Copied", description: "Paste this into src/data/projects.ts to save changes permanently." });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReplaceImage = async (index: number, file: File) => {
    try {
      let publicUrl: string | undefined;
      if (projectId && supabase) {
        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("project-gallery").upload(fileName, file);
          if (!uploadError) { const { data } = supabase.storage.from("project-gallery").getPublicUrl(fileName); publicUrl = data.publicUrl; }
        } catch (err) { console.warn("Upload failed, using local URL", err); }
      }
      if (!publicUrl) publicUrl = URL.createObjectURL(file);
      const newImages = [...images]; newImages[index] = publicUrl;
      const result = await onOrderChange?.(newImages);
      if (result !== false) { setImages(newImages); setImageIds(newImages.map((img, i) => `${i}-${img}`)); toast({ title: "Image replaced" }); }
    } catch { toast({ title: "Failed to replace image", variant: "destructive" }); }
  };

  return (
    <>
      {isEditable && (
        <div className="mb-6 flex justify-between items-center bg-card/10 p-4 rounded-lg border border-primary/20">
          <div className="text-cream text-sm"><span className="font-bold text-primary">Edit Mode Active</span><span className="mx-2">|</span>Drag images to reorder.</div>
          <Button onClick={handleCopyConfig} variant="outline" size="sm" className="flex items-center gap-2 border-primary/50 hover:bg-primary/20 text-cream">
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}{isCopied ? "Copied!" : "Copy Configuration"}
          </Button>
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={imageIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <SortableGalleryItem key={imageIds[index]} id={imageIds[index]} image={image} index={index} projectTitle={projectTitle} projectId={projectId} isEditable={isEditable} onImageClick={onImageClick} onEditImage={onEditImage} onRemoveImage={onRemoveImage} onReplaceImage={handleReplaceImage} />
            ))}
            {isEditable && (
              <div onClick={() => addInputRef.current?.click()} className="aspect-square border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary"><Plus className="w-6 h-6" /></div>
                <span className="text-cream/60 font-medium group-hover:text-primary">Add Image</span>
                <input type="file" accept="image/*" ref={addInputRef} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/")) { toast({ title: "Invalid file type", variant: "destructive" }); return; } if (file.size > 10 * 1024 * 1024) { toast({ title: "File too large", description: "Max 10MB.", variant: "destructive" }); return; } await onAddImage?.(file); e.target.value = ""; }} className="hidden" />
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
};
