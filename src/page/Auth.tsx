import { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // ฟังก์ชันสมัครสมาชิก
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(`Error: ${error.message}`);
        else setMessage('สมัครสำเร็จ! กรุณาเช็คอีเมลเพื่อยืนยัน');
    };

    // ฟังก์ชันเข้าสู่ระบบ
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(`Error: ${error.message}`);
        else setMessage('เข้าสู่ระบบสำเร็จ!');
    };

    // ฟังก์ชันรีเซ็ตรหัสผ่าน
    const handleResetPassword = async () => {
        if (!email) {
            setMessage('กรุณากรอกอีเมลก่อนกดรีเซ็ตรหัสผ่าน');
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) setMessage(`Error: ${error.message}`);
        else setMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว');
    };

    // ฟังก์ชันเข้าสู่ระบบด้วย Google (Gmail)
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) setMessage(`Error: ${error.message}`);
    };

    return (
        <div>
            <h2>ระบบสมาชิก</h2>
            {message && <p><b>{message}</b></p>}

            <form>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" onClick={handleSignIn}>Sign In</button>
                <button type="submit" onClick={handleSignUp}>Sign Up</button>
            </form>

            <br />
            <button onClick={handleResetPassword}>ลืมรหัสผ่าน (Reset Password)</button>
            <br /><br />
            <button onClick={handleGoogleLogin}>Sign in with Google</button>
        </div>
    );
}