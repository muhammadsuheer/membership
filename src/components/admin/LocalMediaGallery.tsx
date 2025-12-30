'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ImageIcon, FolderOpen } from 'lucide-react';

type LocalMediaGalleryProps = {
    images: string[];
};

export default function LocalMediaGallery({ images }: LocalMediaGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (fileName: string, index: number) => {
        const path = `/images/${fileName}`;
        navigator.clipboard.writeText(path);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <FolderOpen className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-gray-900">Project Assets Library</h3>
                        <p className="text-xs text-gray-500">View available local images to use in your content.</p>
                    </div>
                </div>
                <span className="text-sm text-blue-600 font-medium">{isOpen ? 'Hide Library' : 'Show Library'}</span>
            </button>

            {isOpen && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-down">
                    {images.map((img, idx) => (
                        <div key={idx} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                            <div className="relative aspect-square w-full bg-gray-100">
                                <Image
                                    src={`/images/${img}`}
                                    alt={img}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleCopy(img, idx)}
                                        className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                                    >
                                        {copiedIndex === idx ? (
                                            <>
                                                <Check className="w-3 h-3 text-green-600" /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" /> Copy Path
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="p-2">
                                <p className="text-[10px] text-gray-500 truncate" title={img}>
                                    {img}
                                </p>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No images found in public/images</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
