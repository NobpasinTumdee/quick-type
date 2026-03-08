import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { supabase } from '../supabase/supabaseClient';
import { useTranslation } from 'react-i18next';

// 1. กำหนด Type ตาม JSONB ของคุณ
export interface UserSettings {
    behavior: { language: string };
    sound: { volume: number; on_click: string; on_error: string };
    caret: { smooth: string; style: string };
    appearance: { font_family: string; font_size: string };
    theme: { theme: string };
}

// ค่า Default กรณีไม่มีข้อมูล
const defaultSettings: UserSettings = {
    behavior: { language: 'thai' },
    sound: { volume: 50, on_click: 'mech_switch_1', on_error: 'beep_short' },
    caret: { smooth: 'medium', style: '_' },
    appearance: { font_family: 'Sarabun', font_size: 'medium' },
    theme: { theme: 'dark_cyberpunk' }
};

interface SettingsContextType {
    settings: UserSettings;
    updateSetting: (category: keyof UserSettings, newValues: any) => Promise<void>;
    loadSettingsFromSupabase: (userId: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const { i18n } = useTranslation();

    // โหลดค่าเริ่มต้นจาก Cookie (ถ้ามี) หรือใช้ Default
    const [settings, setSettings] = useState<UserSettings>(() => {
        const saved = Cookies.get('user_settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    // ฟังก์ชันปรับใช้ Theme และ ภาษา ทันทีที่ State เปลี่ยน
    useEffect(() => {
        // 1. เพิ่มการเช็คว่า i18n และ changeLanguage พร้อมใช้งานหรือยัง
        if (i18n && typeof i18n.changeLanguage === 'function') {
            if (i18n.language !== settings.behavior.language) {
                i18n.changeLanguage(settings.behavior.language);
            }
        }

        // 2. อัปเดต Theme
        document.documentElement.setAttribute('data-theme', settings.theme.theme);
    }, [settings, i18n]); // ใส่ i18n ลงใน dependency array ด้วย

    // ฟังก์ชันโหลดข้อมูลจาก Supabase (เรียกตอน Login)
    const loadSettingsFromSupabase = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (data && !error) {
            const dbSettings: UserSettings = {
                behavior: data.behavior,
                sound: data.sound,
                caret: data.caret,
                appearance: data.appearance,
                theme: data.theme,
            };
            setSettings(dbSettings);
            Cookies.set('user_settings', JSON.stringify(dbSettings), { expires: 30 }); // เก็บ Cookie ไว้ 30 วัน
        }
    };

    // ฟังก์ชันอัปเดตการตั้งค่า (เซฟลง State -> Cookie -> Supabase)
    const updateSetting = async (category: keyof UserSettings, newValues: any) => {
        const updatedSettings = {
            ...settings,
            [category]: { ...settings[category], ...newValues }
        };

        setSettings(updatedSettings);
        Cookies.set('user_settings', JSON.stringify(updatedSettings), { expires: 30 });

        // ส่งอัปเดตไปที่ Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await supabase
                .from('user_settings')
                .update({ [category]: updatedSettings[category], updated_at: new Date().toISOString() })
                .eq('user_id', session.user.id);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, loadSettingsFromSupabase }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};