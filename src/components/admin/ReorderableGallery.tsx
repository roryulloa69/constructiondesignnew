import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageWithWatermark } from "@/components/ImageWithWatermark";

interface DbImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface SortableGalleryItemProps {
  image: DbImage;
  projectTitle: string;
  index: number;
  onClick: () => void;
}

const SortableGalleryItem = ({ image, projectTitle, index, onClick }: SortableGalleryItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const isFirst = index === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isFirst ? "col-span-full" : ""} ${isDragging ? "ring-2 ring-accent rounded-lg" : ""}`}
    >
      {/* Drag handle overlay */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 rounded-md bg-black/60 text-white cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none"
        aria-label="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded bg-black/60 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
        #{index + 1}
      </span>
      <ImageWithWatermark>
        <button
          onClick={onClick}
          className={`relative ${isFirst ? "w-full aspect-[16/9]" : "aspect-square w-full"} overflow-hidden rounded-lg bg-card border border-border cursor-pointer transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50`}
        >
          <img
            src={image.image_url}
            alt={`${projectTitle} - Image ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 gallery-image"
          />
        </button>
      </ImageWithWatermark>
    </div>
  );
};

interface ReorderableGalleryProps {
  dbImages: DbImage[];
  projectTitle: string;
  onImageClick: (index: number) => void;
  onReorder: (newImages: DbImage[]) => void;
}

export const ReorderableGallery = ({
  dbImages,
  projectTitle,
  onImageClick,
  onReorder,
}: ReorderableGalleryProps) => {
  const [localImages, setLocalImages] = useState(dbImages);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Sync if parent changes
  if (dbImages !== localImages && !hasChanges) {
    setLocalImages(dbImages);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localImages.findIndex((img) => img.id === active.id);
    const newIndex = localImages.findIndex((img) => img.id === over.id);
    const reordered = arrayMove(localImages, oldIndex, newIndex);
    setLocalImages(reordered);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < localImages.length; i++) {
        const { error } = await supabase
          .from("project_images")
          .update({ display_order: i })
          .eq("id", localImages[i].id);
        if (error) throw error;
      }
      setHasChanges(false);
      onReorder(localImages);
      toast.success("Gallery order saved!");
    } catch {
      toast.error("Failed to save order");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalImages(dbImages);
    setHasChanges(false);
  };

  return (
    <div>
      {/* Save/Cancel bar */}
      {hasChanges && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg animate-fade-in">
          <p className="text-sm text-foreground flex-1">You have unsaved reorder changes.</p>
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={saving}>
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-3 w-3 mr-1" /> {saving ? "Saving..." : "Save Order"}
          </Button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localImages.map((img) => img.id)} strategy={rectSortingStrategy}>
          {/* Cover photo */}
          {localImages.length > 0 && (
            <SortableGalleryItem
              key={localImages[0].id}
              image={localImages[0]}
              projectTitle={projectTitle}
              index={0}
              onClick={() => onImageClick(0)}
            />
          )}
          {/* Remaining images */}
          {localImages.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
              {localImages.slice(1).map((image, index) => (
                <SortableGalleryItem
                  key={image.id}
                  image={image}
                  projectTitle={projectTitle}
                  index={index + 1}
                  onClick={() => onImageClick(index + 1)}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
};
