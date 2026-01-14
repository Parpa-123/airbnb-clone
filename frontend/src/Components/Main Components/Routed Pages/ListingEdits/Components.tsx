import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditableSectionProps {
    title: string;
    fields: string[];
    listing: any;
    onPatch: (data: any) => Promise<void>;
    children: (register: any, watch: any) => React.ReactNode;
}

export function EditableSection({ title, fields, listing, onPatch, children }: EditableSectionProps) {
    const { register, handleSubmit, reset, watch } = useForm();

    useEffect(() => {
        const defaults: Record<string, any> = {};
        fields.forEach((fieldName) => {
            defaults[fieldName] = listing[fieldName];
        });
        reset(defaults);
    }, [listing]);

    const submitHandler = async (data: any) => {
        await onPatch(data);
        reset({ ...listing, ...data });
    };

    return (
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                {title}
            </h3>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {children(register, watch)}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => reset(listing)}
                        className="px-5 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-gray-700
                                   hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 bg-linear-to-r from-[#FF385C] to-[#e03050] text-white
                                   rounded-lg font-medium shadow-md hover:shadow-lg hover:from-[#e03050]
                                   hover:to-[#c02848] transition-all duration-200 cursor-pointer"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </section>
    );
}

export interface BackendImage {
    name: string;
    image: string;
    uploaded_at?: string;
}

interface ListingImagesComponentsProps {
    images: BackendImage[];
    onUpload: (data: FormData) => Promise<void>;
}

export function ListingImagesComponents(
    {
        images,
        onUpload
    }: ListingImagesComponentsProps) {
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const MAX_IMAGES = 5;

    const existingImages =
        images.filter((img) => !imagesToDelete.includes(img.image));

    const totalImages =
        existingImages.length + newImages.length;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((f) => f.type.startsWith("image/"));

        if (validFiles.length !== files.length) {
            alert("Only image files are allowed");
        }

        if (totalImages + validFiles.length > MAX_IMAGES) {
            alert(
                `Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - totalImages
                } more.`
            );
            return;
        }

        setNewImages((prev) => [...prev, ...validFiles]);
        e.target.value = "";
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const markForDeletion = (url: string) => {
        setImagesToDelete((prev) => [...prev, url]);
    };

    const undoDeletion = (url: string) => {
        setImagesToDelete((prev) =>
            prev.filter((u) => u !== url)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newImages.length === 0 && imagesToDelete.length === 0) {
            alert("No changes to save");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();

            newImages.forEach((file, index) => {
                formData.append(`images[${index}]file`, file);
                formData.append(
                    `images[${index}]name`,
                    file.name.replace(/\.[^/.]+$/, "")
                );
            });

            if (imagesToDelete.length > 0) {
                formData.append('delete_images', JSON.stringify(imagesToDelete));
            }

            await onUpload(formData);

            setNewImages([]);
            setImagesToDelete([]);
        }
        finally {
            setUploading(false);
        }
    };

    return (
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Property Images
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {}
                {existingImages.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Current Images
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {existingImages.map((img) => {
                                const isMarked =
                                    imagesToDelete.includes(img.image);

                                return (
                                    <div
                                        key={img.image}
                                        className={`relative group ${isMarked ? "opacity-50" : ""
                                            }`}
                                    >
                                        <img
                                            src={img.image}
                                            alt={img.name}
                                            className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/placeholder.png";
                                            }}
                                        />

                                        {}
                                        <div className="absolute inset-0 flex items-center justify-center rounded-lg
                                                        bg-black/0 transition-all">
                                            {isMarked ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        undoDeletion(img.image)
                                                    }
                                                    className="opacity-0 group-hover:opacity-100
                                                               bg-green-500 text-white px-4 py-2
                                                               rounded-lg font-medium transition-opacity cursor-pointer"
                                                >
                                                    Undo
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        markForDeletion(img.image)
                                                    }
                                                    className="opacity-0 group-hover:opacity-100
                                                               bg-red-500 text-white px-4 py-2
                                                               rounded-lg font-medium transition-opacity cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>

                                        <p className="mt-2 text-sm text-gray-600 truncate">
                                            {img.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {}
                {newImages.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                            New Images (Ready to Upload)
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {newImages.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="relative group"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-40 object-cover rounded-lg border-2 border-[#FF385C]"
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center rounded-lg
                                                    bg-black/0 group-hover:bg-black/40 transition-all">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeNewImage(index)
                                            }
                                            className="opacity-0 group-hover:opacity-100
                                                       bg-red-500 text-white px-4 py-2
                                                       rounded-lg font-medium transition-opacity cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <p className="mt-2 text-sm text-gray-600 truncate">
                                        {file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {}
                {totalImages < MAX_IMAGES && (
                    <label className="block border-2 border-dashed border-gray-300
                                      rounded-xl p-8 text-center cursor-pointer
                                      hover:border-[#FF385C] hover:bg-[#FF385C]/5
                                      transition-all">
                        <div className="space-y-2">
                            <div className="text-4xl">📸</div>
                            <div className="text-sm font-medium text-gray-700">
                                Click to upload images
                            </div>
                            <div className="text-xs text-gray-500">
                                {totalImages} of {MAX_IMAGES} images
                            </div>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>
                )}

                {}
                {(newImages.length > 0 || imagesToDelete.length > 0) && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setNewImages([]);
                                setImagesToDelete([]);
                            }}
                            disabled={uploading}
                            className="px-5 py-2.5 border-2 border-gray-300
                                       rounded-lg font-medium text-gray-700
                                       hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-5 py-2.5 bg-[#FF385C] text-white
                                       rounded-lg font-medium shadow-md
                                       hover:bg-[#e03050] disabled:opacity-50 cursor-pointer"
                        >
                            {uploading ? "Uploading..." : "Upload Images"}
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
}
