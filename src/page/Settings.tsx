import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function Settings() {
    const { settings, updateSetting } = useSettings();
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('settings')}</h2>

            <div style={{ marginBottom: '20px' }}>
                <label>{t('language')}: </label>
                <select
                    value={settings.behavior.language}
                    onChange={(e) => updateSetting('behavior', { language: e.target.value })}
                >
                    <option value="thai">ภาษาไทย</option>
                    <option value="en">English</option>
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>{t('theme')}: </label>
                <select
                    value={settings.theme.theme}
                    onChange={(e) => updateSetting('theme', { theme: e.target.value })}
                >
                    <option value="dark_cyberpunk">Dark Cyberpunk</option>
                    <option value="light_minimal">Light Minimal</option>
                    <option value="retro_terminal">Retro Terminal</option>
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Volume ({settings.sound.volume}%): </label>
                <input
                    type="range"
                    min="0" max="100"
                    value={settings.sound.volume}
                    onChange={(e) => updateSetting('sound', { volume: parseInt(e.target.value) })}
                />
            </div>
        </div>
    );
}