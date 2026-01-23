import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
    onImageUploaded: (storageId: string, url: string) => void;
    currentImageUrl?: string;
    className?: string;
    aspectRatio?: 'square' | 'landscape' | 'portrait';
    placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageUploaded,
    currentImageUrl,
    className = '',
    aspectRatio = 'square',
    placeholder = 'Click to upload image'
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const aspectRatioClasses = {
        square: 'aspect-square',
        landscape: 'aspect-video',
        portrait: 'aspect-[3/4]'
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Create a data URL preview
            const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });

            setPreviewUrl(dataUrl);

            // Try to use Convex file storage
            try {
                // Dynamic import to avoid hook issues
                const { api } = await import('../convex/_generated/api');
                const convexReact = await import('convex/react');

                // We need to call the mutation via HTTP since we can't use hooks here
                // For now, just use the data URL directly
                onImageUploaded('dataurl', dataUrl);
            } catch (err) {
                // Fallback: Use data URL
                onImageUploaded('dataurl', dataUrl);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to process image. Please try again.');
            setPreviewUrl(currentImageUrl || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = () => {
        setPreviewUrl(null);
        onImageUploaded('', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />

            <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed 
          ${previewUrl ? 'border-transparent' : 'border-stone-300 hover:border-stone-400'}
          bg-stone-50 cursor-pointer transition-all
          ${aspectRatioClasses[aspectRatio]}
        `}
            >
                {previewUrl ? (
                    <>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                        />
                        {!isUploading && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClear();
                                }}
                                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                            >
                                <X className="h-4 w-4 text-stone-600" />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        {isUploading ? (
                            <>
                                <Loader2 className="h-10 w-10 text-stone-400 animate-spin" />
                                <p className="mt-3 text-sm text-stone-500">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="h-10 w-10 text-stone-400" />
                                <p className="mt-3 text-sm font-medium text-stone-500">{placeholder}</p>
                                <p className="mt-1 text-xs text-stone-400">PNG, JPG, GIF up to 5MB</p>
                            </>
                        )}
                    </div>
                )}

                {isUploading && previewUrl && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="h-10 w-10 text-lime-500 animate-spin" />
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
