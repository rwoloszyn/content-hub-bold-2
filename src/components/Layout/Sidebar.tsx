import React from 'react';
import { 
  Home, 
  FileText, 
  Calendar, 
  Settings, 
  Zap, 
  Share2, 
  BarChart3,
  Image,
  BookOpen,
  Plus
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewPost?: () => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'content', name: 'Content Library', icon: FileText },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'ai-generation', name: 'AI Generation', icon: Zap },
  { id: 'platforms', name: 'Platforms', icon: Share2 },
  { id: 'media', name: 'Media Library', icon: Image },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'notion', name: 'Notion Sync', icon: BookOpen },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, onNewPost }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Skaldora</span>
          </div>
          <div className="mt-2 flex items-center">
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
            >
              <span className="flex items-center space-x-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 3L4 14H13L11 21L20 10H11L13 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Built with bolt.new</span>
              </span>
            </a>
          </div>
        </div>
        
        <div className="p-4">
          {/* New Post Button */}
          <button
            onClick={onNewPost}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mb-6 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>
        
        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
      </div>
    </div>
  );
}