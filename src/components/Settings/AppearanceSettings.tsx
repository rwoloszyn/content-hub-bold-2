import { useState } from 'react';
import { 
  Monitor, 
  Moon, 
  Sun,
  Palette,
  Type,
  Layout,
  Eye,
  Check,
  Zap
} from 'lucide-react';

interface AppearanceSettingsProps {
  onSettingsChange: () => void;
}

export function AppearanceSettings({ onSettingsChange }: AppearanceSettingsProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [colorScheme, setColorScheme] = useState('blue');
  const [fontSize, setFontSize] = useState('medium');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  const colorSchemes = [
    { id: 'blue', name: 'Blue', primary: '#3B82F6', secondary: '#1E40AF' },
    { id: 'purple', name: 'Purple', primary: '#8B5CF6', secondary: '#7C3AED' },
    { id: 'green', name: 'Green', primary: '#10B981', secondary: '#059669' },
    { id: 'orange', name: 'Orange', primary: '#F59E0B', secondary: '#D97706' },
    { id: 'red', name: 'Red', primary: '#EF4444', secondary: '#DC2626' },
    { id: 'pink', name: 'Pink', primary: '#EC4899', secondary: '#DB2777' },
  ];

  const fontSizes = [
    { id: 'small', name: 'Small', size: '14px' },
    { id: 'medium', name: 'Medium', size: '16px' },
    { id: 'large', name: 'Large', size: '18px' },
  ];

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    onSettingsChange();
  };

  const handleColorSchemeChange = (scheme: string) => {
    setColorScheme(scheme);
    onSettingsChange();
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    onSettingsChange();
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Theme</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-4 border-2 rounded-lg transition-all ${
              theme === 'light'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="font-medium text-gray-900">Light</span>
              <div className="w-full h-8 bg-white border border-gray-200 rounded flex">
                <div className="w-1/4 bg-gray-100 rounded-l"></div>
                <div className="flex-1 bg-white"></div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-4 border-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="font-medium text-gray-900">Dark</span>
              <div className="w-full h-8 bg-gray-800 border border-gray-600 rounded flex">
                <div className="w-1/4 bg-gray-700 rounded-l"></div>
                <div className="flex-1 bg-gray-800"></div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleThemeChange('system')}
            className={`p-4 border-2 rounded-lg transition-all ${
              theme === 'system'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <Monitor className={`w-6 h-6 ${theme === 'system' ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="font-medium text-gray-900">System</span>
              <div className="w-full h-8 border border-gray-200 rounded flex">
                <div className="w-1/2 bg-white rounded-l"></div>
                <div className="w-1/2 bg-gray-800 rounded-r"></div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Color Scheme</h3>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => handleColorSchemeChange(scheme.id)}
              className={`p-4 border-2 rounded-lg transition-all ${
                colorScheme === scheme.id
                  ? 'border-gray-400'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="flex space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: scheme.primary }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: scheme.secondary }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{scheme.name}</span>
                {colorScheme === scheme.id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Type className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Typography</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-4">
              {fontSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleFontSizeChange(size.id)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    fontSize === size.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div 
                      className="font-medium text-gray-900 mb-1"
                      style={{ fontSize: size.size }}
                    >
                      Aa
                    </div>
                    <span className="text-sm text-gray-600">{size.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Layout Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Layout className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Layout</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sidebar Collapsed by Default</h4>
              <p className="text-sm text-gray-600">Start with a collapsed sidebar for more content space</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={sidebarCollapsed}
                onChange={(e) => {
                  setSidebarCollapsed(e.target.checked);
                  onSettingsChange();
                }}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Compact Mode</h4>
              <p className="text-sm text-gray-600">Reduce spacing and padding for a denser layout</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={compactMode}
                onChange={(e) => {
                  setCompactMode(e.target.checked);
                  onSettingsChange();
                }}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable Animations</h4>
              <p className="text-sm text-gray-600">Show smooth transitions and micro-interactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={animations}
                onChange={(e) => {
                  setAnimations(e.target.checked);
                  onSettingsChange();
                }}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <div className="flex">
              {!sidebarCollapsed && (
                <div className="w-16 bg-gray-100 rounded mr-4 h-20"></div>
              )}
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}