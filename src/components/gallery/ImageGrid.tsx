import { useState } from "react";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import { ProjectImage } from "./types";
import { ImageCard } from "./ImageCard";

interface ImageGridProps {
  images: ProjectImage[];
  setImages: (images: ProjectImage[]) => void;
  onDelete: (image: ProjectImage) => void;
  onToggle: (image: ProjectImage, field: 'is_before' | 'is_after') => void;
  onReorderSave: (images: ProjectImage[]) => Promise<void>;
}

export const ImageGrid = ({
  images,
  setImages,
  onDelete,
  onToggle,
  onReorderSave,
}: ImageGridProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    // Call parent to save to DB
    await onReorderSave(images);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (images.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-charcoal/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-playfair font-semibold">
          Project Images ({images.length})
        </h2>
        <p className="text-sm text-charcoal/60 flex items-center gap-2">
          <GripVertical className="h-4 w-4" />
          Drag to reorder
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            index={index}
            isDragging={draggedIndex === index}
            isDropTarget={dragOverIndex === index && draggedIndex !== index}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragLeave={() => setDragOverIndex(null)}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};
