import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-base-200 rounded-lg">
        <h2 className="mb-4 font-bold">Choose Theme</h2>

        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${
                theme === t ? "btn-primary" : ""
              }`}
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;