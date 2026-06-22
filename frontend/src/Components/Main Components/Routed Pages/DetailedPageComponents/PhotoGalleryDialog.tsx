import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

interface ImageData {
    image: string;
    name: string;
}

interface PhotoGalleryDialogProps {
    images: ImageData[];
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PhotoGalleryDialog = React.memo(({
    images,
    title,
    open,
    onOpenChange,
}: PhotoGalleryDialogProps) => {
    return (
        <div className="mt-6 relative group">
            {/* Grid Container */}
            <div className="grid grid-cols-4 gap-2 h-[420px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                {/* Main large image */}
                <div className="col-span-2 row-span-2 overflow-hidden relative">
                    <img
                        src={images[0]?.image}
                        alt={images[0]?.name || "Main"}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-500"
                        onClick={() => onOpenChange(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
                </div>

                {/* Grid images */}
                {images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="col-span-1 row-span-1 overflow-hidden relative">
                        <img
                            src={img.image}
                            alt={img.name}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-500"
                            onClick={() => onOpenChange(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <button
                onClick={() => onOpenChange(true)}
                className="absolute bottom-6 right-6 glass border border-white/20 px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/10 backdrop-blur-md shadow-lg transition-all cursor-pointer flex items-center gap-2 z-10"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                View all photos
            </button>

            {/* Fullscreen Dialog */}
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-50 transition-opacity" />
                    <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto custom-scrollbar">
                        <div className="min-h-screen px-4 py-8 relative">
                            <div className="max-w-6xl mx-auto">
                                <div className="flex items-center justify-between mb-8 sticky top-0 z-10 py-4 glass-header px-6 rounded-2xl border border-white/10">
                                    <Dialog.Title className="text-3xl font-bold text-white tracking-tight">
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Close className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer border border-white/10">
                                        <Cross2Icon className="w-6 h-6" />
                                    </Dialog.Close>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="overflow-hidden rounded-2xl glass-card border border-white/10 shadow-xl">
                                            <img
                                                src={img.image}
                                                alt={img.name}
                                                className="w-full h-[500px] object-cover hover:scale-[1.02] transition-transform duration-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
});

export default PhotoGalleryDialog;
