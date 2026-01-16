import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, GripVertical } from "lucide-react";
import { ProjectImage } from "./types";

interface ImageCardProps {
  image: ProjectImage;
  index: number;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDragLeave: () => void;
  onDelete: (image: ProjectImage) => void;
  onToggle: (image: ProjectImage, field: 'is_before' | 'is_after') => void;
}

export const ImageCard = ({
  image,
  index,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragLeave,
  onDelete,
  onToggle,
}: ImageCardProps) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDragLeave={onDragLeave}
      className={`relative group rounded-lg transition-all duration-200 cursor-move overflow-hidden border-2 ${
        isDragging 
          ? 'opacity-40 scale-95 ring-2 ring-primary border-primary' 
          : isDropTarget
          ? 'ring-4 ring-accent scale-105 shadow-lg border-accent'
          : 'bg-cream/20 hover:bg-cream/40 hover:shadow-md border-transparent hover:border-primary/30'
      }`}
    >
      <div className="absolute top-2 left-2 z-10 bg-primary/90 rounded-full p-1.5 shadow-md group-hover:bg-primary transition-colors">
        <GripVertical className="h-5 w-5 text-white" />
      </div>
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
      <img
        src={image.image_url}
        alt={image.title || "Project image"}
        className="w-full aspect-square object-cover"
      />
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Image {index + 1}</p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(image)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={image.is_before}
              onCheckedChange={() => onToggle(image, 'is_before')}
            />
            <Label className="text-xs cursor-pointer">Before</Label>
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={image.is_after}
              onCheckedChange={() => onToggle(image, 'is_after')}
            />
            <Label className="text-xs cursor-pointer">After</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
