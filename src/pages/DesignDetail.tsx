import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { designAlbums } from "@/data/design-albums";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberedGallery } from "@/components/gallery/NumberedGallery";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const DesignDetail = () => {
    const { id } = useParams<{ id: string }>();
    const album = designAlbums.find((a) => a.id === id);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    if (!album) {
        return (
            <Layout>
                <div className="pt-32 pb-24 bg-cream min-h-screen">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl font-serif text-charcoal mb-4">Album Not Found</h1>
                        <Link to="/design"><Button>Back to Design</Button></Link>
                    </div>
                </div>
            </Layout>
        );
    }

    const openLightbox = (index: number) => setSelectedImage(index);
    const closeLightbox = () => setSelectedImage(null);
    const nextImage = () => { if (selectedImage !== null && selectedImage < album.images.length - 1) setSelectedImage(selectedImage + 1); };
    const prevImage = () => { if (selectedImage !== null && selectedImage > 0) setSelectedImage(selectedImage - 1); };

    return (
        <Layout>
            <section className="pt-32 pb-16 bg-cream">
                <div className="container mx-auto px-6">
                    <Link to="/design" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Collections
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-5xl md:text-6xl font-serif text-charcoal mb-4">{album.title}</h1>
                        <p className="text-xl text-muted-foreground">{album.description}</p>
                    </motion.div>
                </div>
            </section>
            <section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <NumberedGallery images={album.images} projectTitle={album.title} onImageClick={openLightbox} onOrderChange={() => {}} isEditable={false} />
                </div>
            </section>
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center">
                        <button onClick={closeLightbox} className="absolute top-6 right-6 text-cream hover:text-primary transition-colors" aria-label="Close lightbox"><X className="w-8 h-8" /></button>
                        <button onClick={prevImage} disabled={selectedImage === 0} className="absolute left-6 text-cream hover:text-primary transition-colors disabled:opacity-30" aria-label="Previous image"><ChevronLeft className="w-12 h-12" /></button>
                        <motion.img key={selectedImage} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} src={album.images[selectedImage]} alt={`${album.title} - Image ${selectedImage + 1}`} className="max-h-[85vh] max-w-[85vw] object-contain" />
                        <button onClick={nextImage} disabled={selectedImage === album.images.length - 1} className="absolute right-6 text-cream hover:text-primary transition-colors disabled:opacity-30" aria-label="Next image"><ChevronRight className="w-12 h-12" /></button>
                        <div className="absolute bottom-6 text-cream/60 text-sm">{selectedImage + 1} / {album.images.length}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default DesignDetail;
