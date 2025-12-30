# SOOOP Membership System - Supabase Complete Setup Guide

This guide details how to set up the robust backend for the SOOOP Membership Portal, enabling:
- **Secure Authentication & Role-Based Access** (Member vs Admin vs Super Admin)
- **Membership Application Workflow** (Submission -> Payment Verification -> Approval)
- **Dynamic CMS** (Update website content from Admin Dashboard)
- **Robust Payment Auditing**

---

## 1. Initial Supabase Project Setup

1.  **Create Project**: Go to [database.new](https://database.new) and create a new project.
2.  **Region**: Select a region close to your users (e.g., Singapore or Mumbai for Pakistan).
3.  **Database Password**: Save this securely.

## 2. Environment Variables

Create a `.env.local` file in your root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Get these from **Supabase Dashboard** -> **Project Settings** -> **API**.

---

## 3. Database Schema Migration

We have designed a robust relational schema. Apply it now:

1.  Go to **Supabase Dashboard** -> **SQL Editor**.
2.  Open/Copy the file from your local project: `supabase/schema.sql`.
3.  Paste it into the SQL Editor and click **RUN**.

### Schema Highlights:
*   **`profiles`**: Stores user identity and `role` ('member', 'admin').
*   **`membership_applications`**: The core workflow table.
*   **`payments`**: Linked to applications, tracks transaction status.
*   **`site_content`**: A Key-Value store (JSONB) for dynamic website sections (CMS).
*   **`audit_logs`**: Tracks every critical action (approvals, rejections).

---

## 4. Storage Setup (Bucket Configuration)

You need to create buckets for file uploads manually or via SQL.

1.  Go to **Storage** in the sidebar.
2.  Create a new bucket named **`documents`**.
    *   **Public**: False (Private). Only authenticated users access their own files.
    *   **RLS Policies**:
        *   SELECT: `(bucket_id = 'documents' AND auth.uid() = owner)`
        *   INSERT: `(bucket_id = 'documents' AND auth.uid() = owner)`
3.  Create a new bucket named **`avatars`**.
    *   **Public**: True (if you want profiles public) or False.
4.  Create a new bucket named **`receipts`**.
    *   **Public**: False. Only Admins and the User verify this.

---

## 5. Authentication Flow Implementation

### Sign Up (Member Registration)
The `MembershipForm.tsx` currently collects data. You need to hook it to Supabase Auth:

```typescript
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.fullName,
      cnic: formData.cnic,
      contact_number: formData.contactNumber,
      // Metadata used by the schema trigger to populate public.profiles
    }
  }
})
```

**Trigger Setup**:
Make sure to create the trigger in Supabase SQL Editor if the strict schema script didn't (sometimes permissions block it from script):

```sql
-- Run this in SQL Editor if 'handle_new_user' trigger isn't working
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 6. Admin Dashboard & Features

### A. Super Administrator Capabilities
*   **User Management**: View all profiles `SELECT * FROM profiles`.
*   **Role Assignment**: Can promote a user to admin:
    ```sql
    UPDATE profiles SET role = 'admin' WHERE email = 'target@email.com';
    ```

### B. Membership Approval Flow
1.  **View Pending**: Query `membership_applications` where `status = 'pending'`.
2.  **Verify Payment**: Check `payments` table. Admin compares the uploaded `receipt_url` with the `transaction_id`.
3.  **Action**:
    *   **Approve**: Update `payments.status = 'verified'` AND `membership_applications.status = 'approved'`.
    *   **Reject**: Update status to 'rejected' and insert reason.

### C. Dynamic CMS (Website Content)
Instead of hardcoding text in `HeroSection.tsx`, fetch it from Supabase.

**Table Structure (`site_content`)**:
```json
// Row Key: 'home_hero'
{
  "title": "Uniting Vision Care Professionals",
  "subtitle": "Join the premier society for Optometrists in Pakistan",
  "banner_image": "https://storage..."
}
```

**Implementation in Next.js**:
```typescript
// src/app/page.tsx
const { data } = await supabase
  .from('site_content')
  .select('content')
  .eq('key', 'home_hero')
  .single();

return <HeroSection content={data?.content} />
```

**Admin CMS Panel**:
Create a page `/admin/cms` where admins can edit these JSON objects using a form builder.

---

## 7. Robust Payment Flow (Detailed)

1.  **Submission**: User submits Form.
    *   Data goes to `membership_applications`.
    *   Payment info goes to `payments` (Status: 'pending').
2.  **Verification (Manual/Admin)**:
    *   Admin logs in.
    *   Goes to "Financial Validations".
    *   Admin checks the screenshot against the bank statement.
3.  **Confirmation**:
    *   Admin clicks "Verify Transaction".
    *   System updates `payments.verified_by = admin_id`.
    *   System automatically triggers Application review or waits for secondary approval (optional).

---

## 8. Next Steps for Developer

1.  **Install Supabase Client**: `npm install @supabase/supabase-js @supabase/ssr`
2.  **Setup Auth Helpers**: Create `src/lib/supabase/client.ts` and `server.ts`.
3.  **Update Signup Page**: Modify `MembershipForm.tsx` to perform the actual `supabase.auth.signUp`.
4.  **Build Admin Routes**: Create `src/app/admin/dashboard/page.tsx` protected by a middleware checking `profile.role === 'admin'`.

This setup ensures your system is secure, scalable, and fully dynamic as requested.
