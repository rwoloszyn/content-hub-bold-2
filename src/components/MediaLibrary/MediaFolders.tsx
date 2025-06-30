import React, { useState } from 'react';
import { Folder, Plus, MoreHorizontal, Edit3, Trash2, FolderOpen } from 'lucide-react';
import { MediaFolder } from '../../types/media';

interface MediaFoldersProps {
  folders: MediaFolder[];
  selectedFolder: string;
  onSelectFolder: (folderId: string) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export function MediaFolders({
  folders,
  selectedFolder,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
}: MediaFoldersProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateForm(false);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder? All files in this folder will be moved to the root.')) {
      onDeleteFolder(folderId);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Folders</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Create folder"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        {/* All Files */}
        <button
          onClick={() => onSelectFolder('all')}
          className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
            selectedFolder === 'all'
              ? 'bg-primary-50 text-primary-700'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span className="text-sm font-medium">All Files</span>
        </button>

        {/* Folders */}
        {folders.map((folder) => (
          <div key={folder.id} className="group">
            <button
              onClick={() => onSelectFolder(folder.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                selectedFolder === folder.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Folder className="w-4 h-4" />
                <span className="text-sm font-medium">{folder.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">{folder.itemCount}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                  title="Delete folder"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            autoFocus
          />
          <div className="flex items-center justify-end space-x-2 mt-2">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewFolderName('');
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}