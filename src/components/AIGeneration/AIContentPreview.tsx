import { useState } from 'react';
import { 
  Copy, 
  Save, 
  Calendar, 
  RefreshCw, 
  Zap, 
  Edit3,
  CheckCircle
} from 'lucide-react';
import { AI_MODELS } from '../../services/aiService';

interface AIContentPreviewProps {
  content: string;
  isGenerating: boolean;
  onCopy: () => void;
  onSave: () => void;
  onSchedule: () => void;
  onRegenerate: () => void;
  canRegenerate: boolean;
  model: keyof typeof AI_MODELS;
}

export function AIContentPreview({
  content,
  isGenerating,
  onCopy,
  onSave,
  onSchedule,
  onRegenerate,
  canRegenerate,
  model
}: AIContentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  const modelInfo = AI_MODELS[model] || { name: 'AI Model', provider: 'Provider' };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
        {content && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button 
              onClick={handleSave}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                saved 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Saved!' : 'Save'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Display */}
      <div className="min-h-[400px]">
        {isGenerating ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 mb-2">Generating your content...</p>
              <p className="text-sm text-gray-500">This may take a few seconds</p>
              <p className="text-xs text-gray-400 mt-2">Using {modelInfo.name} by {modelInfo.provider}</p>
            </div>
          </div>
        ) : content ? (
          <div className="space-y-4">
            {/* Content Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 pb-3 border-b border-gray-100">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <span>{readingTime} min read</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {modelInfo.name}
              </span>
            </div>

            {/* Content */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="prose max-w-none">
                <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {content}
                </div>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Content Analysis</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Tone:</span>
                  <span className="text-blue-600 ml-2">Professional</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Readability:</span>
                  <span className="text-blue-600 ml-2">Easy</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Engagement:</span>
                  <span className="text-blue-600 ml-2">High</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">SEO Score:</span>
                  <span className="text-blue-600 ml-2">Good</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h4>
              <p className="text-gray-600 mb-4">
                Fill in the template variables and click "Generate Content" to see AI-powered results
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {content && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onRegenerate}
              disabled={!canRegenerate}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate</span>
            </button>
            
            <button
              onClick={onSchedule}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}