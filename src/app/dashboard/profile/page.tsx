import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export const metadata: Metadata = {
    title: 'Profile - SOOOP Dashboard',
    description: 'Update your SOOOP member profile',
};

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <DashboardLayout>
            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-primary mb-8">Edit Profile</h1>

                <div className="card">
                    <form className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                                M
                            </div>
                            <div>
                                <button type="button" className="btn btn-outline text-sm py-2">
                                    Change Photo
                                </button>
                                <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="label">First Name</label>
                                <input type="text" className="input" defaultValue="Member" />
                            </div>
                            <div>
                                <label className="label">Last Name</label>
                                <input type="text" className="input" defaultValue="User" />
                            </div>
                        </div>

                        <div>
                            <label className="label">Email Address</label>
                            <input type="email" className="input" defaultValue={user.email} disabled />
                            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="label">Phone Number</label>
                            <input type="tel" className="input" placeholder="+92-XXX-XXXXXXX" />
                        </div>

                        <div>
                            <label className="label">Address</label>
                            <textarea className="textarea" rows={3} placeholder="Enter your address"></textarea>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                            <button type="button" className="btn btn-ghost">Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="card mt-8">
                    <h2 className="text-xl font-bold text-primary mb-6">Change Password</h2>
                    <form className="space-y-6">
                        <div>
                            <label className="label">Current Password</label>
                            <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="label">New Password</label>
                                <input type="password" className="input" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="label">Confirm New Password</label>
                                <input type="password" className="input" placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary">Update Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
