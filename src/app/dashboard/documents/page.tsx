import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export const metadata: Metadata = {
    title: 'Documents - SOOOP Dashboard',
    description: 'View and download your SOOOP documents',
};

const documents = [
    {
        name: 'Membership Certificate',
        type: 'PDF',
        size: '156 KB',
        date: 'Jan 15, 2024',
        status: 'Available',
    },
    {
        name: 'SOOOP Membership Form',
        type: 'PDF',
        size: '192 KB',
        date: 'Jan 10, 2024',
        status: 'Available',
    },
    {
        name: 'Member Oath',
        type: 'PDF',
        size: '88 KB',
        date: 'Jan 10, 2024',
        status: 'Available',
    },
    {
        name: 'Conference Registration',
        type: 'PDF',
        size: '245 KB',
        date: 'Dec 5, 2024',
        status: 'Pending',
    },
];

export default async function DocumentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary">Documents</h1>
                    <button className="btn btn-primary">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload Document
                    </button>
                </div>

                {/* Documents Table */}
                <div className="card overflow-hidden p-0">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Size</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc, index) => (
                                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-error/10 text-error flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium text-gray-900">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{doc.type}</td>
                                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{doc.size}</td>
                                    <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">{doc.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${doc.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {doc.status === 'Available' ? (
                                            <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-sm">--</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm text-gray-700">
                                <strong className="text-primary">Need additional documents?</strong> Contact our support team at{' '}
                                <a href="mailto:info@sooopvision.org" className="text-accent hover:underline">info@sooopvision.org</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
