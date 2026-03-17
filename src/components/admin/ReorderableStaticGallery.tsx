import { useState, useEffect } from "react";
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
import { GripVertical, Save, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ImageWithWatermark } from "@/components/ImageWithWatermark";

interface StaticImage {
  id: string;
  url: string;
}

interface SortableStaticItemProps {
  image: StaticImage;
  projectTitle: string;
  index: number;
  onClick: () => void;
}

const SortableStaticItem = ({ image, projectTitle, index, onClick }: SortableStaticItemProps) => {
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
            src={image.url}
            alt={`${projectTitle} - Image ${index + 1}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 gallery-image"
          />
        </button>
      </ImageWithWatermark>
    </div>
  );
};

const STORAGE_KEY_PREFIX = "static-gallery-order-";

function getStoredOrder(projectId: string): string[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + projectId);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredOrder(projectId: string, order: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + projectId, JSON.stringify(order));
  } catch {
    // Ignore storage errors
  }
}

function clearStoredOrder(projectId: string) {
  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + projectId);
  } catch {
    // Ignore
  }
}

interface ReorderableStaticGalleryProps {
  projectId: string;
  images: string[];
  projectTitle: string;
  onImageClick: (index: number) => void;
  onReorderedImages: (images: string[]) => void;
}

export const ReorderableStaticGallery = ({
  projectId,
  images,
  projectTitle,
  onImageClick,
  onReorderedImages,
}: ReorderableStaticGalleryProps) => {
  // Create stable IDs for static images
  const originalItems: StaticImage[] = images.map((url, i) => ({
    id: `static-${i}`,
    url,
  }));

  // Apply stored order
  const applyStoredOrder = (): StaticImage[] => {
    const storedOrder = getStoredOrder(projectId);
    if (!storedOrder) return originalItems;
    
    const reordered: StaticImage[] = [];
    for (const id of storedOrder) {
      const item = originalItems.find(img => img.id === id);
      if (item) reordered.push(item);
    }
    // Add any new images not in stored order
    for (const item of originalItems) {
      if (!reordered.find(r => r.id === item.id)) {
        reordered.push(item);
      }
    }
    return reordered;
  };

  const [localImages, setLocalImages] = useState<StaticImage[]>(applyStoredOrder);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Notify parent of current order
  useEffect(() => {
    onReorderedImages(localImages.map(img => img.url));
  }, [localImages, onReorderedImages]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localImages.findIndex((img) => img.id === active.id);
    const newIndex = localImages.findIndex((img) => img.id === over.id);
    const reordered = arrayMove(localImages, oldIndex, newIndex);
    setLocalImages(reordered);
    setHasChanges(true);
  };

  const handleSave = () => {
    setStoredOrder(projectId, localImages.map(img => img.id));
    setHasChanges(false);
    toast.success("Gallery order saved!");
  };

  const handleCancel = () => {
    setLocalImages(applyStoredOrder());
    setHasChanges(false);
  };

  const handleReset = () => {
    clearStoredOrder(projectId);
    setLocalImages(originalItems);
    setHasChanges(false);
    onReorderedImages(images);
    toast.success("Gallery order reset to default");
  };

  return (
    <div>
      {hasChanges && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg animate-fade-in">
          <p className="text-sm text-foreground flex-1">You have unsaved reorder changes.</p>
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={false}>
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-3 w-3 mr-1" /> Save Order
          </Button>
        </div>
      )}

      {!hasChanges && getStoredOrder(projectId) && (
        <div className="flex justify-end mb-4">
          <Button size="sm" variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3 w-3 mr-1" /> Reset to Default
          </Button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localImages.map((img) => img.id)} strategy={rectSortingStrategy}>
          {localImages.length > 0 && (
            <SortableStaticItem
              key={localImages[0].id}
              image={localImages[0]}
              projectTitle={projectTitle}
              index={0}
              onClick={() => onImageClick(0)}
            />
          )}
          {localImages.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
              {localImages.slice(1).map((image, index) => (
                <SortableStaticItem
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
