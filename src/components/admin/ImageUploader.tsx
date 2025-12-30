'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Upload, X, Copy, Check, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function ImageUploader() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [recentUploads, setRecentUploads] = useState<string[]>([]);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            setUploadError("Please select an image file (PNG, JPG, WEBP).");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setUploadError("File size must be less than 5MB.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            // sanitize filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from('cms-media')
                .upload(filePath, file);

            if (error) throw error;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('cms-media')
                .getPublicUrl(filePath);

            setRecentUploads(prev => [publicUrl, ...prev]);

            // Auto-copy
            navigator.clipboard.writeText(publicUrl);
            setCopiedUrl(publicUrl);
            setTimeout(() => setCopiedUrl(null), 3000);

        } catch (err: any) {
            console.error('Upload failed:', err);
            setUploadError(err.message || 'Upload failed. Ensure you created the "cms-media" bucket.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-accent" />
                Upload Media
            </h3>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Upload Area */}
                <div className="w-full md:w-1/3">
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isUploading ? 'bg-gray-50 border-gray-300' : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                            }`}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                <span className="text-sm font-medium text-gray-500">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center cursor-pointer">
                                <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Click to Upload Image</span>
                                <span className="text-xs text-gray-500 mt-1">Max 5MB (JPG, PNG, WEBP)</span>
                            </div>
                        )}
                    </div>
                    {uploadError && (
                        <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">
                            Error: {uploadError}
                        </p>
                    )}
                </div>

                {/* Recent Uploads List */}
                <div className="w-full md:w-2/3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Recently Uploaded</h4>
                    {recentUploads.length === 0 ? (
                        <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-lg flex items-center justify-center h-[120px]">
                            No uploads in this session yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {recentUploads.map((url, idx) => (
                                <div key={idx} className="group relative rounded-lg border border-gray-200 overflow-hidden bg-gray-100 aspect-square">
                                    <Image
                                        src={url}
                                        alt="Uploaded"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => handleCopy(url)}
                                            className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg hover:scale-105 transition-transform"
                                        >
                                            {copiedUrl === url ? (
                                                <Check className="w-3 h-3 text-green-600" />
                                            ) : (
                                                <Copy className="w-3 h-3" />
                                            )}
                                            {copiedUrl === url ? "Copied" : "Copy URL"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {recentUploads.length > 0 && (
                        <p className="text-xs text-gray-500 mt-3">
                            <span className="font-semibold text-green-600">Tip:</span> Copy the URL and paste it into the image fields in the editors below.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
