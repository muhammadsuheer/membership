'use client';

import { useState } from 'react';
import { MemberData, approveMembership, rejectMembership, expireMembership } from '@/app/admin/members/actions';
import { format } from 'date-fns';
import { Loader2, Eye, CheckCircle, XCircle, Clock, Search, FileText, User } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function MemberManageTable({ initialMembers }: { initialMembers: MemberData[] }) {
    const [members, setMembers] = useState(initialMembers);
    const [filteredMembers, setFilteredMembers] = useState(initialMembers);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Approval Form State
    const [specialty, setSpecialty] = useState('');
    const [expiryDate, setExpiryDate] = useState(
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    );

    // Filter Effect
    useState(() => {
        let result = members;

        // Status Filter
        if (filter !== 'all') {
            result = result.filter(m => m.membership_status === filter);
        }

        // Search Filter
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(m =>
                m.full_name?.toLowerCase().includes(q) ||
                m.cnic?.includes(q) ||
                m.email?.toLowerCase().includes(q) ||
                m.registration_number?.toLowerCase().includes(q)
            );
        }

        setFilteredMembers(result);
        setCurrentPage(1); // Reset to page 1 on filter
    });

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleApprove = async () => {
        if (!selectedMember || !specialty) {
            toast.error("Please enter a specialty");
            return;
        }
        setIsActionLoading(true);
        try {
            await approveMembership(selectedMember.id, specialty, expiryDate);
            toast.success("Member approved successfully");

            // Update local state
            const updated = members.map(m => m.id === selectedMember.id ? {
                ...m,
                membership_status: 'active',
                specialty,
                membership_expiry: expiryDate,
                registration_number: "Updated (Refresh)" // In reality we'd need to re-fetch or return data from action
            } : m);

            setMembers(updated);
            setSelectedMember(null);
        } catch (error) {
            toast.error("Failed to approve");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedMember) return;
        setIsActionLoading(true);
        try {
            await rejectMembership(selectedMember.id);
            toast.success("Member rejected");
            setMembers(members.map(m => m.id === selectedMember.id ? { ...m, membership_status: 'rejected' } : m));
            setSelectedMember(null);
        } catch (error) {
            toast.error("Failed to reject");
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Controls Bar */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'active', 'expired', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === status
                                ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-100'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                            <span className="ml-2 text-xs opacity-80 bg-black/10 px-1.5 py-0.5 rounded-full">
                                {status === 'all'
                                    ? members.length
                                    : members.filter(m => m.membership_status === status).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full xl:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Name, CNIC, Reg#..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                    />
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 w-[280px]">Member Profile</th>
                                <th className="px-6 py-4">Identification</th>
                                <th className="px-6 py-4">Membership Info</th>
                                <th className="px-6 py-4">Joined On</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedMembers.length > 0 ? (
                                paginatedMembers.map(member => (
                                    <tr key={member.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 ring-2 ring-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                                                    {member.profile_photo_url ? (
                                                        <Image src={member.profile_photo_url} alt="" width={40} height={40} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-gray-900 truncate">{member.full_name}</div>
                                                    <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                                                        {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-1">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <span className="font-mono bg-gray-100 px-1 rounded">{member.cnic}</span>
                                                </div>
                                                <div className="text-gray-500">{member.contact_number}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                <StatusBadge status={member.membership_status} />
                                                {member.registration_number && (
                                                    <div className="text-xs text-gray-600 font-mono">
                                                        #{member.registration_number}
                                                    </div>
                                                )}
                                                {member.specialty && (
                                                    <div className="text-xs text-primary-600 font-medium">
                                                        {member.specialty}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {format(new Date(member.created_at), 'MMM dd, yyyy')}
                                            <div className="text-[10px] text-gray-400 bg-gray-50 inline-block px-1 rounded mt-1">
                                                ID: {member.id.substring(0, 6)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedMember(member);
                                                    setSpecialty(member.specialty || '');
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-600 rounded-lg shadow-sm"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="w-8 h-8 opacity-20" />
                                            <p>No members found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredMembers.length)}</span> of <span className="font-medium">{filteredMembers.length}</span> members
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${currentPage === page
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 sticky top-0 z-10 backdrop-blur-xl bg-white/80">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow-md overflow-hidden">
                                    {selectedMember.profile_photo_url ? (
                                        <Image src={selectedMember.profile_photo_url} alt="" width={64} height={64} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-2xl">
                                            {selectedMember.full_name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedMember.full_name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <StatusBadge status={selectedMember.membership_status} />
                                        <span className="text-sm text-gray-500 border-l border-gray-300 pl-2 ml-2">{selectedMember.email}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedMember(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 grid lg:grid-cols-3 gap-8">
                            {/* LEFT COLUMN: INFO */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Personal Info */}
                                <section>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">CNIC</div>
                                            <div className="font-medium font-mono bg-gray-50 inline-block px-2 py-1 rounded">{selectedMember.cnic}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Contact Number</div>
                                            <div className="font-medium font-mono">{selectedMember.contact_number}</div>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <div className="text-xs text-gray-500 mb-1">Residential Address</div>
                                            <div className="font-medium text-gray-800">{selectedMember.residential_address || 'N/A'}</div>
                                        </div>
                                    </div>
                                </section>

                                {/* Documents */}
                                <section>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Attached Documents</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {selectedMember.documents?.map((doc, idx) => (
                                            <a
                                                key={idx}
                                                href={doc.file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-center gap-2"
                                            >
                                                <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow text-primary-600">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-700 group-hover:text-primary-800 capitalize">
                                                    {doc.document_type.replace(/_/g, ' ')}
                                                </span>
                                            </a>
                                        ))}
                                        {(!selectedMember.documents || selectedMember.documents.length === 0) && (
                                            <div className="col-span-full py-4 text-center text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                No documents uploaded.
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT COLUMN: ACTIONS & PAYMENT */}
                            <div className="space-y-6">
                                {/* Workflow Box */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-primary" /> Approval Actions
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Assign Specialty</label>
                                            <input
                                                type="text"
                                                value={specialty}
                                                onChange={e => setSpecialty(e.target.value)}
                                                className="input w-full bg-white"
                                                placeholder="e.g. Optometrist"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Valid Until</label>
                                            <input
                                                type="date"
                                                value={expiryDate}
                                                onChange={e => setExpiryDate(e.target.value)}
                                                className="input w-full bg-white"
                                            />
                                        </div>

                                        <div className="pt-2 grid grid-cols-2 gap-3">
                                            <button
                                                onClick={handleReject}
                                                disabled={isActionLoading}
                                                className="btn btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 w-full"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={handleApprove}
                                                disabled={isActionLoading}
                                                className="btn btn-primary w-full shadow-lg shadow-primary/20"
                                            >
                                                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info Box */}
                                <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-3 text-sm uppercase tracking-wide">Payment Status</h3>
                                    {selectedMember.latest_payment ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                                <span className="text-xs text-gray-500">Amount Paid</span>
                                                <span className="font-bold text-gray-900 text-lg">Rs. {selectedMember.latest_payment.amount}</span>
                                            </div>

                                            <div className="text-xs space-y-1 text-gray-600 px-1">
                                                <div className="flex justify-between">
                                                    <span>Transaction ID:</span>
                                                    <span className="font-mono">{selectedMember.latest_payment.transaction_id}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Status:</span>
                                                    <span className="uppercase font-bold text-green-600">{selectedMember.latest_payment.status}</span>
                                                </div>
                                            </div>

                                            {selectedMember.latest_payment.receipt_url && (
                                                <a
                                                    href={selectedMember.latest_payment.receipt_url}
                                                    target="_blank"
                                                    className="block w-full text-center py-2 text-xs font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                                                >
                                                    View Payment Receipt
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 bg-white/50 rounded-lg border border-dashed border-blue-200">
                                            <p className="text-xs text-gray-500">No payment record found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        active: "bg-green-100 text-green-700 border-green-200",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        expired: "bg-orange-100 text-orange-700 border-orange-200",
        rejected: "bg-red-100 text-red-700 border-red-200"
    };
    const icons = {
        active: <CheckCircle className="w-3 h-3" />,
        pending: <Clock className="w-3 h-3" />,
        expired: <Clock className="w-3 h-3" />,
        rejected: <XCircle className="w-3 h-3" />
    };

    // @ts-ignore
    const style = styles[status] || "bg-gray-100 text-gray-700";
    // @ts-ignore
    const icon = icons[status] || null;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} capitalize`}>
            {icon} {status}
        </span>
    );
}
