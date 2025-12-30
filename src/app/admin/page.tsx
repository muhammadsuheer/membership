import Link from 'next/link';
import { FileText, Users, Settings, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of system status and quick actions.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Link href="/admin/cms" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Content Management</h3>
                    <p className="text-gray-500 text-sm mb-4">Edit homepage sections, heroes, and announcements dynamically.</p>
                    <span className="text-blue-600 font-medium text-sm flex items-center">
                        Manage Content <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                </Link>

                <Link href="/admin/members" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Member Management</h3>
                    <p className="text-gray-500 text-sm mb-4">View applications, approve members, and manage payments.</p>
                    <span className="text-green-600 font-medium text-sm flex items-center">
                        View Members <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                </Link>

                <div className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 opacity-75 cursor-not-allowed">
                    <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center mb-4">
                        <Settings className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">System Settings</h3>
                    <p className="text-gray-500 text-sm mb-4">Configure global settings, fees, and database parameters.</p>
                    <span className="text-gray-400 font-medium text-sm flex items-center">
                        Coming Soon
                    </span>
                </div>
            </div>
        </div>
    );
}
