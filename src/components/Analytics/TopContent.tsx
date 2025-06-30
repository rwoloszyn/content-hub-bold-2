import React from 'react';
import { TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

interface TopContentProps {
  timeRange: string;
  platform: string;
}

const topPosts = [
  {
    id: '1',
    title: '5 Tips for Better Content Marketing',
    platform: 'Facebook',
    publishedDate: '2024-01-15',
    reach: 12500,
    engagement: 890,
    likes: 654,
    comments: 123,
    shares: 113,
    engagementRate: 7.1,
    thumbnail: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '2',
    title: 'The Future of AI in Creative Industries',
    platform: 'LinkedIn',
    publishedDate: '2024-01-12',
    reach: 8900,
    engagement: 1200,
    likes: 890,
    comments: 156,
    shares: 154,
    engagementRate: 13.5,
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '3',
    title: 'Quick Tutorial: Social Media Automation',
    platform: 'Instagram',
    publishedDate: '2024-01-10',
    reach: 15600,
    engagement: 1850,
    likes: 1456,
    comments: 234,
    shares: 160,
    engagementRate: 11.9,
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '4',
    title: 'Building Your Personal Brand Online',
    platform: 'Twitter',
    publishedDate: '2024-01-08',
    reach: 6700,
    engagement: 456,
    likes: 334,
    comments: 67,
    shares: 55,
    engagementRate: 6.8,
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

export function TopContent({ timeRange, platform }: TopContentProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Content</h3>
        
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full font-bold text-sm">
                  #{index + 1}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{post.title}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>{post.platform}</span>
                  <span>•</span>
                  <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{post.reach.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1 text-red-500">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-500">
                  <Share2 className="w-4 h-4" />
                  <span>{post.shares}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">{post.engagementRate}%</div>
                <div className="text-sm text-gray-500">Engagement</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Best Performing Content Types</h4>
          <div className="space-y-3">
            {[
              { type: 'Tutorial Videos', performance: 92, color: 'bg-green-500' },
              { type: 'Industry Insights', performance: 87, color: 'bg-blue-500' },
              { type: 'Behind the Scenes', performance: 78, color: 'bg-purple-500' },
              { type: 'Product Updates', performance: 65, color: 'bg-yellow-500' },
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.performance}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.performance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Optimal Posting Times</h4>
          <div className="space-y-3">
            {[
              { time: '9:00 AM', engagement: '8.2%', day: 'Tuesday' },
              { time: '1:00 PM', engagement: '7.8%', day: 'Wednesday' },
              { time: '6:00 PM', engagement: '7.5%', day: 'Thursday' },
              { time: '11:00 AM', engagement: '7.1%', day: 'Monday' },
            ].map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{slot.time}</div>
                  <div className="text-sm text-gray-600">{slot.day}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary-600">{slot.engagement}</div>
                  <div className="text-sm text-gray-500">Avg. Engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}