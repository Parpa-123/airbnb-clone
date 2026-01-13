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

/**
 * Airbnb-style photo grid with lightbox dialog.
 */
const PhotoGalleryDialog: React.FC<PhotoGalleryDialogProps> = ({
    images,
    title,
    open,
    onOpenChange,
}) => {
    return (
        <div className="mt-6 relative">
            {/* Images Grid */}
            <div className="grid grid-cols-4 gap-2 h-[420px] rounded-xl overflow-hidden">
                {/* Main Large Image */}
                <div className="col-span-2 row-span-2">
                    <img
                        src={images[0]?.image}
                        alt={images[0]?.name || "Main"}
                        className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
                        onClick={() => onOpenChange(true)}
                    />
                </div>

                {/* Four Smaller Images */}
                {images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="col-span-1 row-span-1">
                        <img
                            src={img.image}
                            alt={img.name}
                            className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
                            onClick={() => onOpenChange(true)}
                        />
                    </div>
                ))}
            </div>

            {/* View All Photos Button */}
            <button
                onClick={() => onOpenChange(true)}
                className="absolute bottom-4 right-4 bg-white border border-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer flex items-center gap-2"
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

            {/* Photo Gallery Dialog */}
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50" />
                    <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="min-h-screen px-4 py-8">
                            <div className="max-w-5xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title className="text-2xl font-semibold text-white">
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Close className="text-white hover:text-gray-300 transition cursor-pointer">
                                        <Cross2Icon className="w-6 h-6" />
                                    </Dialog.Close>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img.image}
                                            alt={img.name}
                                            className="w-full rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default PhotoGalleryDialog;
