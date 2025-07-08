import { useState } from 'react';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertTriangle,
  Clock,
  MapPin,
  Monitor,
  RefreshCw,
  Download,
  Trash2
} from 'lucide-react';

interface SecuritySettingsProps {
  onSettingsChange: () => void;
}

export function SecuritySettings({ onSettingsChange }: SecuritySettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const activeSessions = [
    {
      id: '1',
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      browser: 'Chrome 118.0',
      lastActive: '2 minutes ago',
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 14 Pro',
      location: 'San Francisco, CA',
      browser: 'Safari Mobile',
      lastActive: '1 hour ago',
      current: false,
    },
    {
      id: '3',
      device: 'Windows PC',
      location: 'New York, NY',
      browser: 'Edge 118.0',
      lastActive: '3 days ago',
      current: false,
    },
  ];

  const loginHistory = [
    {
      id: '1',
      timestamp: '2024-01-15 14:30:00',
      location: 'San Francisco, CA',
      device: 'MacBook Pro',
      status: 'success',
    },
    {
      id: '2',
      timestamp: '2024-01-15 09:15:00',
      location: 'San Francisco, CA',
      device: 'iPhone 14 Pro',
      status: 'success',
    },
    {
      id: '3',
      timestamp: '2024-01-14 16:45:00',
      location: 'Unknown Location',
      device: 'Unknown Device',
      status: 'failed',
    },
  ];

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    onSettingsChange();
  };

  const handlePasswordSubmit = () => {
    // Validate and submit password change
    console.log('Password change submitted');
  };

  const handleEnable2FA = () => {
    setShowQRCode(true);
  };

  const handleConfirm2FA = () => {
    setTwoFactorEnabled(true);
    setShowQRCode(false);
    onSettingsChange();
  };

  const handleDisable2FA = () => {
    if (window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      setTwoFactorEnabled(false);
      onSettingsChange();
    }
  };

  const handleTerminateSession = (sessionId: string) => {
    console.log('Terminate session:', sessionId);
  };

  const handleTerminateAllSessions = () => {
    if (window.confirm('This will sign you out of all devices except this one. Continue?')) {
      console.log('Terminate all sessions');
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Key className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        </div>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordSubmit}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Update Password
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Password Requirements:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Include at least one number</li>
            <li>• Include at least one special character</li>
          </ul>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Smartphone className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
        </div>
        
        {!twoFactorEnabled ? (
          <div>
            <div className="flex items-start space-x-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Enhance Your Security</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Two-factor authentication adds an extra layer of security to your account by requiring 
                  a verification code from your phone in addition to your password.
                </p>
              </div>
            </div>
            
            {!showQRCode ? (
              <button
                onClick={handleEnable2FA}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Enable Two-Factor Authentication
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Setup Instructions:</h5>
                  <ol className="text-sm text-gray-700 space-y-1">
                    <li>1. Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>2. Scan the QR code below with your authenticator app</li>
                    <li>3. Enter the 6-digit code from your app to confirm</li>
                  </ol>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">QR Code</span>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={handleConfirm2FA}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Confirm & Enable
                      </button>
                      <button
                        onClick={() => setShowQRCode(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication Enabled</h4>
                <p className="text-sm text-gray-600">Your account is protected with 2FA</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                View Recovery Codes
              </button>
              <button
                onClick={handleDisable2FA}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
          </div>
          <button
            onClick={handleTerminateAllSessions}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Terminate All Other Sessions
          </button>
        </div>
        
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Monitor className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{session.device}</h4>
                    {session.current && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{session.location}</span>
                    </span>
                    <span>{session.browser}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{session.lastActive}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {!session.current && (
                <button
                  onClick={() => handleTerminateSession(session.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Terminate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Login Activity</h3>
        </div>
        
        <div className="space-y-3">
          {loginHistory.map((login) => (
            <div key={login.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  login.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-gray-900">
                      {new Date(login.timestamp).toLocaleDateString()} at {new Date(login.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      login.status === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {login.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {login.location} • {login.device}
                  </div>
                </div>
              </div>
              
              {login.status === 'failed' && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
        
        <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
          View Full Login History
        </button>
      </div>

      {/* Security Recommendations */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">Security Recommendations</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Use a unique, strong password for your ContentHub account</li>
              <li>• Enable two-factor authentication for additional security</li>
              <li>• Regularly review your active sessions and login history</li>
              <li>• Keep your devices and browsers up to date</li>
              <li>• Never share your login credentials with others</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}