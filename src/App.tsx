import { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ContentLibrary } from './components/ContentManagement/ContentLibrary';
import { ContentEditor } from './components/ContentManagement/ContentEditor';
import { CalendarView } from './components/Calendar/CalendarView';
import { AIGeneration } from './components/AIGeneration/AIGeneration';
import { Analytics } from './components/Analytics/Analytics';
import { MediaLibrary } from './components/MediaLibrary/MediaLibrary';
import { PlatformManagement } from './components/PlatformManagement/PlatformManagement';
import { NotionSync } from './components/NotionSync/NotionSync';
import { Settings } from './components/Settings/Settings';
import { AuthContainer } from './components/Auth/AuthContainer';
import { ResetPassword } from './components/Auth/ResetPassword';
import { useAuth } from './hooks/useAuth';
import { useContentData } from './hooks/useContentData';
import { ContentItem, CalendarEvent, PlatformType } from './types';
import { analyticsService } from './services/analyticsService';
import { sentryService } from './services/sentryService';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [showContentEditor, setShowContentEditor] = useState(false);
  
  const {
    contentItems,
    calendarEvents,
    platforms,
    loading,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    scheduleContent,
  } = useContentData();

  // Track tab changes for analytics
  useEffect(() => {
    if (isAuthenticated) {
      analyticsService.pageView(`/${activeTab}`);
      
      // Add breadcrumb for tab navigation
      sentryService.addBreadcrumb({
        category: 'navigation',
        message: `Navigated to ${activeTab} tab`,
        level: 'info'
      });
    }
  }, [activeTab, isAuthenticated]);

  // Check if this is a password reset route
  const isPasswordResetRoute = window.location.pathname === '/reset-password';

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show password reset screen if on reset password route
  if (isPasswordResetRoute) {
    return <ResetPassword />;
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  const handleEditContent = (content: ContentItem) => {
    setEditingContent(content);
    setShowContentEditor(true);
    analyticsService.event('Content', 'Edit', content.type);
    
    // Add breadcrumb for content editing
    sentryService.addBreadcrumb({
      category: 'content',
      message: `Editing content: ${content.title}`,
      data: { contentId: content.id, contentType: content.type },
      level: 'info'
    });
  };

  const handleDeleteContent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContentItem(id);
      
      // Add breadcrumb for content deletion
      sentryService.addBreadcrumb({
        category: 'content',
        message: `Deleted content`,
        data: { contentId: id },
        level: 'info'
      });
    }
  };

  const handleDuplicateContent = (content: ContentItem) => {
    const duplicate = {
      ...content,
      title: `${content.title} (Copy)`,
      status: 'draft' as const,
      platforms: [],
      scheduledDate: undefined,
      publishedDate: undefined,
    };
    delete (duplicate as any).id;
    delete (duplicate as any).createdAt;
    delete (duplicate as any).updatedAt;
    
    addContentItem(duplicate);
    analyticsService.event('Content', 'Duplicated', content.type);
    
    // Add breadcrumb for content duplication
    sentryService.addBreadcrumb({
      category: 'content',
      message: `Duplicated content: ${content.title}`,
      data: { sourceContentId: content.id, contentType: content.type },
      level: 'info'
    });
  };

  const handleScheduleContent = (content: ContentItem) => {
    setEditingContent(content);
    setShowContentEditor(true);
    analyticsService.event('Content', 'Schedule Initiated', content.type);
    
    // Add breadcrumb for schedule initiation
    sentryService.addBreadcrumb({
      category: 'content',
      message: `Initiated scheduling for content: ${content.title}`,
      data: { contentId: content.id, contentType: content.type },
      level: 'info'
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    const content = contentItems.find(item => item.id === event.contentId);
    if (content) {
      handleEditContent(content);
    }
  };

  const handleDateClick = (date: Date) => {
    setEditingContent(null);
    setShowContentEditor(true);
    analyticsService.event('Calendar', 'Date Click', date.toISOString().split('T')[0]);
    
    // Add breadcrumb for calendar date click
    sentryService.addBreadcrumb({
      category: 'calendar',
      message: `Clicked on calendar date: ${date.toISOString().split('T')[0]}`,
      level: 'info'
    });
  };

  const handleNewContent = () => {
    setEditingContent(null);
    setShowContentEditor(true);
    analyticsService.event('Content', 'New Content Initiated');
    
    // Add breadcrumb for new content
    sentryService.addBreadcrumb({
      category: 'content',
      message: 'Initiated new content creation',
      level: 'info'
    });
  };

  const handleSaveContent = (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingContent) {
      updateContentItem(editingContent.id, contentData);
      analyticsService.event('Content', 'Updated', contentData.type);
      
      // Add breadcrumb for content update
      sentryService.addBreadcrumb({
        category: 'content',
        message: `Updated content: ${contentData.title}`,
        data: { contentId: editingContent.id, contentType: contentData.type },
        level: 'info'
      });
    } else {
      addContentItem(contentData);
      analyticsService.event('Content', 'Created', contentData.type);
      
      // Add breadcrumb for content creation
      sentryService.addBreadcrumb({
        category: 'content',
        message: `Created new content: ${contentData.title}`,
        data: { contentType: contentData.type },
        level: 'info'
      });
    }
    setShowContentEditor(false);
    setEditingContent(null);
  };

  const handleScheduleFromEditor = (content: ContentItem, date: Date, time: string, platforms: PlatformType[]) => {
    scheduleContent(content.id, date, time, platforms);
    updateContentItem(content.id, { 
      status: 'scheduled',
      scheduledDate: date,
      platforms: platforms.map(type => ({ type, connected: true }))
    });
    analyticsService.event('Content', 'Scheduled', platforms.join(','));
    
    // Add breadcrumb for content scheduling
    sentryService.addBreadcrumb({
      category: 'content',
      message: `Scheduled content: ${content.title}`,
      data: { 
        contentId: content.id, 
        scheduledDate: date.toISOString(),
        platforms: platforms.join(',')
      },
      level: 'info'
    });
  };

  const handleUpdatePlatform = (platformType: PlatformType, updates: any) => {
    // Handle platform updates
    console.log('Update platform:', platformType, updates);
    analyticsService.event('Platform', 'Updated', platformType);
    
    // Add breadcrumb for platform update
    sentryService.addBreadcrumb({
      category: 'platform',
      message: `Updated platform: ${platformType}`,
      data: { platformType, updates },
      level: 'info'
    });
  };

  const handleConnectPlatform = async (platformType: PlatformType, credentials: any) => {
    // Handle platform connection
    console.log('Connect platform:', platformType, credentials);
    analyticsService.event('Platform', 'Connected', platformType);
    
    // Add breadcrumb for platform connection
    sentryService.addBreadcrumb({
      category: 'platform',
      message: `Connected platform: ${platformType}`,
      data: { platformType },
      level: 'info'
    });
  };

  const handleDisconnectPlatform = (platformType: PlatformType) => {
    // Handle platform disconnection
    console.log('Disconnect platform:', platformType);
    analyticsService.event('Platform', 'Disconnected', platformType);
    
    // Add breadcrumb for platform disconnection
    sentryService.addBreadcrumb({
      category: 'platform',
      message: `Disconnected platform: ${platformType}`,
      data: { platformType },
      level: 'info'
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    analyticsService.pageView(`/${tab}`);
    
    // Add breadcrumb for tab change
    sentryService.addBreadcrumb({
      category: 'navigation',
      message: `Changed tab to: ${tab}`,
      level: 'info'
    });
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Overview of your content performance' };
      case 'content':
        return { title: 'Content Library', subtitle: 'Manage all your content in one place' };
      case 'calendar':
        return { title: 'Content Calendar', subtitle: 'Schedule and organize your posts' };
      case 'ai-generation':
        return { title: 'AI Content Generation', subtitle: 'Create content with artificial intelligence' };
      case 'platforms':
        return { title: 'Platform Management', subtitle: 'Connect and manage your social accounts' };
      case 'media':
        return { title: 'Media Library', subtitle: 'Organize your images and videos' };
      case 'analytics':
        return { title: 'Analytics', subtitle: 'Track your content performance and audience insights' };
      case 'notion':
        return { title: 'Notion Integration', subtitle: 'Sync content with your Notion workspace' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Configure your account and preferences' };
      default:
        return { title: 'Skaldora', subtitle: '' };
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard contentItems={contentItems} calendarEvents={calendarEvents} />;
      case 'content':
        return (
          <ContentLibrary
            contentItems={contentItems}
            onEdit={handleEditContent}
            onDelete={handleDeleteContent}
            onDuplicate={handleDuplicateContent}
            onSchedule={handleScheduleContent}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            events={calendarEvents}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
          />
        );
      case 'ai-generation':
        return <AIGeneration />;
      case 'analytics':
        return <Analytics />;
      case 'media':
        return <MediaLibrary />;
      case 'platforms':
        return (
          <PlatformManagement
            platforms={platforms}
            onUpdatePlatform={handleUpdatePlatform}
            onConnectPlatform={handleConnectPlatform}
            onDisconnectPlatform={handleDisconnectPlatform}
          />
        );
      case 'notion':
        return <NotionSync />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="flex-1 ml-64">
        <Header 
          title={title} 
          subtitle={subtitle}
          onNewContent={activeTab === 'content' ? handleNewContent : undefined}
        />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Content Editor Modal */}
      <ContentEditor
        content={editingContent}
        isOpen={showContentEditor}
        onClose={() => {
          setShowContentEditor(false);
          setEditingContent(null);
        }}
        onSave={handleSaveContent}
        onSchedule={handleScheduleFromEditor}
      />
    </div>
  );
}

export default App;