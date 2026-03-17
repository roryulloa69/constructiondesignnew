import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Upload, X, GripVertical } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface SortableGalleryItemProps {
  id: string; image: string; index: number; projectTitle: string; projectId?: string;
  isEditable: boolean; onImageClick: (index: number) => void; onEditImage?: (image: string) => void;
  onRemoveImage?: (index: number) => void; onReplaceImage?: (index: number, file: File) => void;
}

export const SortableGalleryItem = ({ id, image, index, projectTitle, isEditable, onImageClick, onEditImage, onRemoveImage, onReplaceImage }: SortableGalleryItemProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !isEditable });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 50 : "auto" as const };

  return (
    <div ref={setNodeRef} style={style} className="aspect-square overflow-hidden group relative bg-black/20">
      {isEditable && (
        <>
          <div {...attributes} {...listeners} className="absolute top-2 left-2 z-10 p-1.5 bg-charcoal/80 rounded-md backdrop-blur-sm cursor-grab active:cursor-grabbing text-cream hover:text-primary transition-colors" title="Drag to reorder"><GripVertical className="w-4 h-4" /></div>
          <div className="absolute top-2 right-2 z-10 flex gap-1 bg-charcoal/80 rounded-md p-1 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="p-1.5 rounded hover:bg-primary hover:text-primary-foreground text-cream transition-colors" title="Replace image"><Upload className="w-4 h-4" /></button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/")) { toast({ title: "Invalid file type", variant: "destructive" }); return; } if (file.size > 10 * 1024 * 1024) { toast({ title: "File too large", variant: "destructive" }); return; } onReplaceImage?.(index, file); e.target.value = ""; }} className="hidden" />
            {onRemoveImage && <button onClick={(e) => { e.stopPropagation(); if (confirm("Remove this image?")) onRemoveImage(index); }} className="p-1.5 rounded hover:bg-destructive hover:text-white text-cream transition-colors" title="Remove image"><X className="w-4 h-4" /></button>}
          </div>
          {onEditImage && <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); onEditImage(image); }} className="bg-charcoal/80 text-cream p-2 rounded-md hover:bg-primary hover:text-primary-foreground backdrop-blur-sm" title="Redesign with AI"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg></button></div>}
        </>
      )}
      <img src={image} alt={`${projectTitle} - Image ${index + 1}`} onClick={() => onImageClick(index)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer" />
    </div>
  );
};
