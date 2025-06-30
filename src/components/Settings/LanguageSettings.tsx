import React, { useState } from 'react';
import { 
  Globe, 
  Clock, 
  Calendar, 
  DollarSign,
  MapPin,
  Check
} from 'lucide-react';

interface LanguageSettingsProps {
  onSettingsChange: () => void;
}

export function LanguageSettings({ onSettingsChange }: LanguageSettingsProps) {
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12');
  const [currency, setCurrency] = useState('USD');
  const [region, setRegion] = useState('US');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ];

  const timezones = [
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8' },
    { value: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7' },
    { value: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6' },
    { value: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5' },
    { value: 'UTC', label: 'Coordinated Universal Time', offset: 'UTC+0' },
    { value: 'Europe/London', label: 'Greenwich Mean Time', offset: 'UTC+0' },
    { value: 'Europe/Paris', label: 'Central European Time', offset: 'UTC+1' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: 'UTC+9' },
    { value: 'Asia/Shanghai', label: 'China Standard Time', offset: 'UTC+8' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time', offset: 'UTC+10' },
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/31/2024' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '31/12/2024' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2024-12-31' },
    { value: 'DD MMM YYYY', label: 'DD MMM YYYY', example: '31 Dec 2024' },
    { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY', example: 'Dec 31, 2024' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    onSettingsChange();
  };

  const handleTimezoneChange = (tz: string) => {
    setTimezone(tz);
    onSettingsChange();
  };

  const handleDateFormatChange = (format: string) => {
    setDateFormat(format);
    onSettingsChange();
  };

  const handleTimeFormatChange = (format: string) => {
    setTimeFormat(format);
    onSettingsChange();
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    onSettingsChange();
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Language</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`p-3 border-2 rounded-lg text-left transition-all ${
                language === lang.code
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{lang.name}</div>
                  <div className="text-sm text-gray-600">{lang.nativeName}</div>
                </div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timezone */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Timezone</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => handleTimezoneChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} ({tz.offset})
                </option>
              ))}
            </select>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>Current time:</strong> {new Date().toLocaleString('en-US', { 
                timeZone: timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time Format */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Date & Time Format</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <div className="space-y-2">
              {dateFormats.map((format) => (
                <label key={format.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="dateFormat"
                    value={format.value}
                    checked={dateFormat === format.value}
                    onChange={(e) => handleDateFormatChange(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-900">{format.label}</span>
                  <span className="text-sm text-gray-500">({format.example})</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="timeFormat"
                  value="12"
                  checked={timeFormat === '12'}
                  onChange={(e) => handleTimeFormatChange(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-900">12-hour</span>
                <span className="text-sm text-gray-500">(2:30 PM)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="timeFormat"
                  value="24"
                  checked={timeFormat === '24'}
                  onChange={(e) => handleTimeFormatChange(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-900">24-hour</span>
                <span className="text-sm text-gray-500">(14:30)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Currency</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default currency for pricing and analytics
          </label>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.name} ({curr.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Regional Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Use metric system</h4>
              <p className="text-sm text-gray-600">Display measurements in metric units</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Language:</span>
            <span className="font-medium text-gray-900">
              {languages.find(l => l.code === language)?.name}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: dateFormat.includes('MMM') ? 'short' : '2-digit',
                day: '2-digit'
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleTimeString('en-US', {
                hour12: timeFormat === '12',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Currency:</span>
            <span className="font-medium text-gray-900">
              {currencies.find(c => c.code === currency)?.symbol}1,234.56
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}