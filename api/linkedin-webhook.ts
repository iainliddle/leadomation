import { createClient } from '@supabase/supabase-js';

// Use service role for webhook to update any user's profile
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = req.body;

        console.log('LinkedIn webhook received:', JSON.stringify(payload, null, 2));

        // Extract account info from Unipile webhook payload
        const accountId = payload.account_id || payload.id;
        const accountName = payload.name; // This should be the user's email we set during connect
        const provider = payload.provider || payload.type;

        if (!accountId) {
            console.error('No account_id in webhook payload');
            return res.status(400).json({ error: 'Missing account_id' });
        }

        if (!accountName) {
            console.error('No name/email in webhook payload');
            return res.status(400).json({ error: 'Missing account name' });
        }

        // Only process LinkedIn accounts
        if (provider && provider !== 'LINKEDIN') {
            console.log('Ignoring non-LinkedIn webhook:', provider);
            return res.status(200).json({ success: true, message: 'Ignored non-LinkedIn webhook' });
        }

        // Find user by email and update their profile with the Unipile account ID
        const { data: users, error: userError } = await supabase.auth.admin.listUsers();

        if (userError) {
            console.error('Error listing users:', userError);
            return res.status(500).json({ error: 'Failed to find user' });
        }

        const matchingUser = users.users.find(u => u.email === accountName);

        if (!matchingUser) {
            console.error('No user found with email:', accountName);
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's profile with the Unipile account ID
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                unipile_account_id: accountId,
                linkedin_connected: true
            })
            .eq('id', matchingUser.id);

        if (updateError) {
            console.error('Error updating profile:', updateError);
            return res.status(500).json({ error: 'Failed to update profile' });
        }

        console.log('Successfully updated profile for user:', matchingUser.email, 'with account:', accountId);

        return res.status(200).json({
            success: true,
            message: 'LinkedIn account connected successfully'
        });
    } catch (error: any) {
        console.error('LinkedIn webhook error:', error);
        return res.status(500).json({
            error: 'Webhook processing failed',
            details: error.message
        });
    }
}
