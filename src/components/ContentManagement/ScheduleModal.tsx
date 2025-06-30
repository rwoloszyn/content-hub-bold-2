import React, { useState } from 'react';
import { X, Calendar, Clock, Globe } from 'lucide-react';
import { PlatformType } from '../../types';
import { format, addDays } from 'date-fns';

interface ScheduleModalProps {
  onClose: () => void;
  onSchedule: (date: Date, time: string, platforms: PlatformType[]) => void;
  platforms: PlatformType[];
}

export function ScheduleModal({ onClose, onSchedule, platforms }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(platforms);
  const [timezone, setTimezone] = useState('America/New_York');

  const handleSchedule = () => {
    const date = new Date(`${selectedDate}T${selectedTime}`);
    onSchedule(date, selectedTime, selectedPlatforms);
  };

  const togglePlatform = (platform: PlatformType) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const suggestedTimes = [
    { time: '09:00', label: '9:00 AM - Morning Peak' },
    { time: '12:00', label: '12:00 PM - Lunch Break' },
    { time: '15:00', label: '3:00 PM - Afternoon' },
    { time: '18:00', label: '6:00 PM - Evening Peak' },
    { time: '21:00', label: '9:00 PM - Night Scroll' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Content</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Time
            </label>
            <div className="space-y-2">
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              {/* Suggested Times */}
              <div className="grid grid-cols-1 gap-2">
                <p className="text-xs text-gray-500 mb-1">Suggested times:</p>
                {suggestedTimes.map(({ time, label }) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTime === time
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platforms
            </label>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Schedule Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Date: {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</p>
              <p>Time: {selectedTime} ({timezone})</p>
              <p>Platforms: {selectedPlatforms.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={selectedPlatforms.length === 0}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
}