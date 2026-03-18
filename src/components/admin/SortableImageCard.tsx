import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, RotateCw, Trash2 } from "lucide-react";

interface ProjectImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  rotation_angle: number;
  display_order: number;
}

interface SortableImageCardProps {
  image: ProjectImage;
  onRotate: (imageId: string, currentRotation: number) => void;
  onDelete: (imageId: string) => void;
}

export const SortableImageCard = ({ image, onRotate, onDelete }: SortableImageCardProps) => {
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

  return (
    <Card ref={setNodeRef} style={style} className={isDragging ? "ring-2 ring-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground">#{image.display_order + 1}</span>
        </div>
        
        <div 
          className="relative aspect-square mb-3 overflow-hidden rounded-md bg-muted"
          style={{
            transform: `rotate(${image.rotation_angle}deg)`,
          }}
        >
          <img
            src={image.image_url}
            alt={image.title || "Project image"}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRotate(image.id, image.rotation_angle)}
            className="flex-1"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(image.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
