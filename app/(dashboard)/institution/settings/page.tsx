'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Building, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Save, 
  Upload, 
  Eye, 
  EyeOff,
  Check,
  X,
  AlertCircle,
  Crown,
  Zap,
  Lock,
  Key,
  UserCheck,
  BookOpen,
  Award,
  Palette
} from 'lucide-react';
import { Users } from '@/components/ui/Users';
import { 
  getInstituteByAdminId, 
  updateInstitute,
  getUserId,
  InstituteDTO
} from '@/app/components/services/api';

interface SettingsSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

const InstitutionSettings = () => {
  const [institute, setInstitute] = useState<InstituteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    instituteName: '',
    instituteCode: '',
    description: '',
    email: '',
    phoneNumber: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    establishedDate: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    studentUpdates: true,
    courseUpdates: true,
    subscriptionUpdates: true
  });
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordPolicy: 'medium',
    ipWhitelist: '',
    auditLogs: true
  });

  const settingsSections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General Information',
      icon: Building,
      description: 'Basic institute information and contact details'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Configure notification preferences and alerts'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      description: 'Security settings and access controls'
    },
    {
      id: 'billing',
      title: 'Billing & Subscriptions',
      icon: CreditCard,
      description: 'Manage subscriptions and billing information'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Globe,
      description: 'Third-party integrations and API settings'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of your institute portal'
    }
  ];

  useEffect(() => {
    loadInstituteData();
  }, []);

  const loadInstituteData = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const instituteData = await getInstituteByAdminId(parseInt(userId));
      setInstitute(instituteData);
      
      setFormData({
        instituteName: instituteData.instituteName || '',
        instituteCode: instituteData.instituteCode || '',
        description: instituteData.description || '',
        email: instituteData.email || '',
        phoneNumber: instituteData.phoneNumber || '',
        website: instituteData.website || '',
        address: instituteData.address || '',
        city: instituteData.city || '',
        state: instituteData.state || '',
        country: instituteData.country || '',
        postalCode: instituteData.postalCode || '',
        establishedDate: instituteData.establishedDate ? instituteData.establishedDate.split('T')[0] : ''
      });
    } catch (error) {
      console.error('Failed to load institute data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!institute) return;

    try {
      setSaving(true);
      const updatedInstitute: InstituteDTO = {
        ...institute,
        ...formData,
        establishedDate: formData.establishedDate ? `${formData.establishedDate}T00:00:00` : institute.establishedDate
      };

      await updateInstitute(institute.instituteId, updatedInstitute);
      setInstitute(updatedInstitute);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const SectionCard = ({ section, isActive, onClick }: { section: SettingsSection; isActive: boolean; onClick: () => void }) => (
    <div 
      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50 shadow-lg' 
          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/10'}`}>
          <section.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{section.title}</h3>
          <p className="text-slate-300 text-sm mt-1">{section.description}</p>
        </div>
      </div>
    </div>
  );

  const FormField = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    required = false,
    icon: Icon
  }: {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    icon?: any;
  }) => (
    <div className="space-y-2">
      <label className="text-white font-medium flex items-center space-x-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const ToggleSwitch = ({ 
    label, 
    description, 
    checked, 
    onChange 
  }: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        {description && <p className="text-slate-300 text-sm mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/20'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Institute Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Institute Name"
            value={formData.instituteName}
            onChange={(value) => handleInputChange('instituteName', value)}
            placeholder="Enter institute name"
            required
            icon={Building}
          />
          <FormField
            label="Institute Code"
            value={formData.instituteCode}
            onChange={(value) => handleInputChange('instituteCode', value)}
            placeholder="Enter institute code"
            required
          />
          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="Enter email address"
            required
            icon={Mail}
          />
          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={(value) => handleInputChange('phoneNumber', value)}
            placeholder="Enter phone number"
            icon={Phone}
          />
          <FormField
            label="Website"
            type="url"
            value={formData.website}
            onChange={(value) => handleInputChange('website', value)}
            placeholder="https://example.com"
            icon={Globe}
          />
          <FormField
            label="Established Date"
            type="date"
            value={formData.establishedDate}
            onChange={(value) => handleInputChange('establishedDate', value)}
            icon={Calendar}
          />
        </div>
        <div className="mt-6">
          <label className="text-white font-medium block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter institute description"
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              label="Street Address"
              value={formData.address}
              onChange={(value) => handleInputChange('address', value)}
              placeholder="Enter street address"
              icon={MapPin}
            />
          </div>
          <FormField
            label="City"
            value={formData.city}
            onChange={(value) => handleInputChange('city', value)}
            placeholder="Enter city"
          />
          <FormField
            label="State/Province"
            value={formData.state}
            onChange={(value) => handleInputChange('state', value)}
            placeholder="Enter state or province"
          />
          <FormField
            label="Country"
            value={formData.country}
            onChange={(value) => handleInputChange('country', value)}
            placeholder="Enter country"
          />
          <FormField
            label="Postal Code"
            value={formData.postalCode}
            onChange={(value) => handleInputChange('postalCode', value)}
            placeholder="Enter postal code"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          <ToggleSwitch
            label="Email Notifications"
            description="Receive notifications via email"
            checked={notifications.emailNotifications}
            onChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
          />
          <ToggleSwitch
            label="SMS Notifications"
            description="Receive notifications via SMS"
            checked={notifications.smsNotifications}
            onChange={(checked) => setNotifications(prev => ({ ...prev, smsNotifications: checked }))}
          />
          <ToggleSwitch
            label="Push Notifications"
            description="Receive browser push notifications"
            checked={notifications.pushNotifications}
            onChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
          />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Report Preferences</h3>
        <div className="space-y-4">
          <ToggleSwitch
            label="Weekly Reports"
            description="Receive weekly performance reports"
            checked={notifications.weeklyReports}
            onChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
          />
          <ToggleSwitch
            label="Monthly Reports"
            description="Receive monthly analytics reports"
            checked={notifications.monthlyReports}
            onChange={(checked) => setNotifications(prev => ({ ...prev, monthlyReports: checked }))}
          />
          <ToggleSwitch
            label="Student Updates"
            description="Get notified about student activities"
            checked={notifications.studentUpdates}
            onChange={(checked) => setNotifications(prev => ({ ...prev, studentUpdates: checked }))}
          />
          <ToggleSwitch
            label="Course Updates"
            description="Get notified about course changes"
            checked={notifications.courseUpdates}
            onChange={(checked) => setNotifications(prev => ({ ...prev, courseUpdates: checked }))}
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Security Settings</h3>
        </div>
        <div className="space-y-4">
          <ToggleSwitch
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={security.twoFactorAuth}
            onChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))}
          />
          <ToggleSwitch
            label="Audit Logs"
            description="Keep detailed logs of all activities"
            checked={security.auditLogs}
            onChange={(checked) => setSecurity(prev => ({ ...prev, auditLogs: checked }))}
          />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <Key className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Access Control</h3>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <label className="text-white font-medium">Session Timeout (minutes)</label>
            </div>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <label className="text-white font-medium">Password Policy</label>
            </div>
            <select
              value={security.passwordPolicy}
              onChange={(e) => setSecurity(prev => ({ ...prev, passwordPolicy: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low - 6 characters minimum</option>
              <option value="medium">Medium - 8 characters with mixed case</option>
              <option value="high">High - 12 characters with special characters</option>
            </select>
          </div>
          
          {/* Additional Security Options */}
          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-green-400" />
                <div>
                  <h4 className="text-white font-medium">User Verification</h4>
                  <p className="text-slate-300 text-sm">Require email verification for new users</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Enabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 w-fit mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Premium Institution Plan</h3>
          <p className="text-slate-300">Unlock advanced features for your institute</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">Unlimited</div>
            <div className="text-slate-300 text-sm">Students</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-slate-300 text-sm">Global Courses</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">Advanced</div>
            <div className="text-slate-300 text-sm">Analytics</div>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
            Upgrade to Premium
          </button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Current Subscriptions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <h4 className="text-white font-medium">Basic Institution Plan</h4>
              <p className="text-slate-300 text-sm">Up to 100 students</p>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">₹9,999/month</div>
              <div className="text-green-400 text-sm">Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Institution Settings
              </h1>
              <p className="text-slate-300 mt-1">
                Manage your institute's configuration and preferences
              </p>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sticky top-8">
              {settingsSections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                />
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeSection === 'general' && renderGeneralSettings()}
            {activeSection === 'notifications' && renderNotificationSettings()}
            {activeSection === 'security' && renderSecuritySettings()}
            {activeSection === 'billing' && renderBillingSettings()}
            {activeSection === 'integrations' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
                  <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Integrations Coming Soon</h3>
                  <p className="text-slate-400 mb-6">Connect with third-party services and APIs</p>
                  
                  {/* Preview Integration Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-3">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <h4 className="text-white font-medium">Zapier</h4>
                      </div>
                      <p className="text-slate-300 text-sm">Automate workflows and connect apps</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-3">
                        <Mail className="w-6 h-6 text-blue-400" />
                        <h4 className="text-white font-medium">Email Services</h4>
                      </div>
                      <p className="text-slate-300 text-sm">Connect with Gmail, Outlook, and more</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Palette className="w-6 h-6 text-pink-400" />
                    <h3 className="text-xl font-semibold text-white">Appearance Customization</h3>
                  </div>
                  
                  {/* Theme Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 border-2 border-blue-400">
                      <div className="text-white font-medium mb-2">Ocean Blue</div>
                      <div className="text-blue-100 text-sm">Current theme</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-4 border-2 border-transparent hover:border-green-400 cursor-pointer transition-colors">
                      <div className="text-white font-medium mb-2">Forest Green</div>
                      <div className="text-green-100 text-sm">Nature inspired</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 border-2 border-transparent hover:border-purple-400 cursor-pointer transition-colors">
                      <div className="text-white font-medium mb-2">Royal Purple</div>
                      <div className="text-purple-100 text-sm">Premium look</div>
                    </div>
                  </div>
                  
                  {/* Logo Upload */}
                  <div className="border-t border-white/20 pt-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Upload className="w-5 h-5 text-slate-400" />
                      <h4 className="text-white font-medium">Institute Logo</h4>
                    </div>
                    <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
                      <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-4">Upload your institute logo</p>
                      <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                        Choose File
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionSettings;