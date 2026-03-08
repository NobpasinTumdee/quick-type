import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Auth from '../Auth';

import { useSettings } from '../../context/SettingsContext';

const Rootlayout = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const { loadSettingsFromSupabase } = useSettings();


    useEffect(() => {
        // ดึง session ตอนโหลดครั้งแรก
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                loadSettingsFromSupabase(session.user.id);
            }
            setLoading(false);
        });

        // ดักจับการเปลี่ยนแปลง (เช่น ตอนกด Login หรือ Logout)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                loadSettingsFromSupabase(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // ฟังก์ชันออกจากระบบ
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) return <div>Loading...</div>;

    // ถ้าไม่มี Session (ไม่ได้ Login)
    if (!session) {
        return (
            <>
                <h1>ไม่ได้ login</h1>
                <Auth />
            </>
        );
    }

    // ถ้า Login แล้ว แสดงเนื้อหาปกติพร้อม Outlet ของ React Router
    return (
        <>
            <header>
                <p>ยินดีต้อนรับ: {session.user.email}</p>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Rootlayout;