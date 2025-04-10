import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: '',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12',
      timezone: 'UTC',
      defaultLanguage: 'en',
      fiscalYearStart: '01-01',
      currency: 'USD',
      weekStartDay: 'Monday'
    },
    email: {
      smtpServer: '',
      smtpPort: '',
      smtpUser: '',
      smtpPassword: '',
      senderEmail: '',
      senderName: '',
      enableSSL: true
    },
    notifications: {
      enableEmailNotifications: true,
      enableAppNotifications: true,
      enableAttendanceReminders: true,
      enableLeaveApprovalNotifications: true,
      enablePayrollProcessingNotifications: true,
      enableBirthdayNotifications: true,
      enablePerformanceReviewNotifications: true
    },
    security: {
      passwordPolicy: 'medium',
      sessionTimeout: '30',
      maxLoginAttempts: '5',
      twoFactorAuthentication: false,
      passwordExpiryDays: '90',
      ipRestriction: false,
      allowedIPs: ''
    },
    backup: {
      automaticBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      storageLocation: 'cloud',
      retentionPeriod: '30'
    }
  });

  // Fetch system settings on component mount
  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      // const response = await api.get('/settings/system');
      // setSettings(response.data);
      
      // Simulating API response delay
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast.error('Failed to load system settings');
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (section, field) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: !prevSettings[section][field]
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaveLoading(true);
    try {
      // Mock API call - replace with actual API
      // await api.post('/settings/system', settings);
      
      // Simulating API response delay
      setTimeout(() => {
        toast.success('System settings saved successfully');
        setSaveLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast.error('Failed to save system settings');
      setSaveLoading(false);
    }
  };

  const handleTestEmailConnection = () => {
    setIsModalOpen(true);
  };

  const sendTestEmail = async () => {
    try {
      // Mock API call - replace with actual API
      // await api.post('/settings/test-email', settings.email);
      toast.success('Test email sent successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-4">
      <Input
        label="Company Name"
        value={settings.general.companyName}
        onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
        placeholder="Enter company name"
      />
      
      <Select
        label="Date Format"
        value={settings.general.dateFormat}
        onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
        options={[
          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
        ]}
      />
      
      <Select
        label="Time Format"
        value={settings.general.timeFormat}
        onChange={(e) => handleInputChange('general', 'timeFormat', e.target.value)}
        options={[
          { value: '12', label: '12-hour (AM/PM)' },
          { value: '24', label: '24-hour' }
        ]}
      />
      
      <Select
        label="Timezone"
        value={settings.general.timezone}
        onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
        options={[
          { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
          { value: 'EST', label: 'EST (Eastern Standard Time)' },
          { value: 'PST', label: 'PST (Pacific Standard Time)' },
          { value: 'IST', label: 'IST (Indian Standard Time)' }
        ]}
      />
      
      <Select
        label="Default Language"
        value={settings.general.defaultLanguage}
        onChange={(e) => handleInputChange('general', 'defaultLanguage', e.target.value)}
        options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' }
        ]}
      />
      
      <Input
        label="Fiscal Year Start (MM-DD)"
        value={settings.general.fiscalYearStart}
        onChange={(e) => handleInputChange('general', 'fiscalYearStart', e.target.value)}
        placeholder="MM-DD"
      />
      
      <Select
        label="Currency"
        value={settings.general.currency}
        onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
        options={[
          { value: 'USD', label: 'USD ($)' },
          { value: 'EUR', label: 'EUR (€)' },
          { value: 'GBP', label: 'GBP (£)' },
          { value: 'INR', label: 'INR (₹)' }
        ]}
      />
      
      <Select
        label="Week Starts On"
        value={settings.general.weekStartDay}
        onChange={(e) => handleInputChange('general', 'weekStartDay', e.target.value)}
        options={[
          { value: 'Sunday', label: 'Sunday' },
          { value: 'Monday', label: 'Monday' }
        ]}
      />
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-4">
      <Input
        label="SMTP Server"
        value={settings.email.smtpServer}
        onChange={(e) => handleInputChange('email', 'smtpServer', e.target.value)}
        placeholder="e.g., smtp.gmail.com"
      />
      
      <Input
        label="SMTP Port"
        value={settings.email.smtpPort}
        onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
        placeholder="e.g., 587"
      />
      
      <Input
        label="SMTP Username"
        value={settings.email.smtpUser}
        onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
        placeholder="Enter username"
      />
      
      <Input
        label="SMTP Password"
        type="password"
        value={settings.email.smtpPassword}
        onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
        placeholder="Enter password"
      />
      
      <Input
        label="Sender Email"
        value={settings.email.senderEmail}
        onChange={(e) => handleInputChange('email', 'senderEmail', e.target.value)}
        placeholder="e.g., hr@yourcompany.com"
      />
      
      <Input
        label="Sender Name"
        value={settings.email.senderName}
        onChange={(e) => handleInputChange('email', 'senderName', e.target.value)}
        placeholder="e.g., HR Department"
      />
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableSSL"
          checked={settings.email.enableSSL}
          onChange={() => handleCheckboxChange('email', 'enableSSL')}
          className="mr-2"
        />
        <label htmlFor="enableSSL">Enable SSL/TLS</label>
      </div>
      
      <Button 
        label="Test Connection" 
        onClick={handleTestEmailConnection} 
        variant="secondary"
      />
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {Object.keys(settings.notifications).map(key => (
        <div key={key} className="flex items-center">
          <input
            type="checkbox"
            id={key}
            checked={settings.notifications[key]}
            onChange={() => handleCheckboxChange('notifications', key)}
            className="mr-2"
          />
          <label htmlFor={key}>
            {key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .replace(/Enable /g, '')}
          </label>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <Select
        label="Password Policy"
        value={settings.security.passwordPolicy}
        onChange={(e) => handleInputChange('security', 'passwordPolicy', e.target.value)}
        options={[
          { value: 'low', label: 'Low - Minimum 6 characters' },
          { value: 'medium', label: 'Medium - Minimum 8 characters with numbers' },
          { value: 'high', label: 'High - Minimum 10 characters with special chars, numbers, and mixed case' }
        ]}
      />
      
      <Input
        label="Session Timeout (minutes)"
        value={settings.security.sessionTimeout}
        onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
        type="number"
        min="5"
        max="180"
      />
      
      <Input
        label="Maximum Login Attempts"
        value={settings.security.maxLoginAttempts}
        onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
        type="number"
        min="3"
        max="10"
      />
      
      <Input
        label="Password Expiry (days)"
        value={settings.security.passwordExpiryDays}
        onChange={(e) => handleInputChange('security', 'passwordExpiryDays', e.target.value)}
        type="number"
        min="30"
        max="365"
      />
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="twoFactorAuthentication"
          checked={settings.security.twoFactorAuthentication}
          onChange={() => handleCheckboxChange('security', 'twoFactorAuthentication')}
          className="mr-2"
        />
        <label htmlFor="twoFactorAuthentication">Enable Two-Factor Authentication</label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="ipRestriction"
          checked={settings.security.ipRestriction}
          onChange={() => handleCheckboxChange('security', 'ipRestriction')}
          className="mr-2"
        />
        <label htmlFor="ipRestriction">Enable IP Restriction</label>
      </div>
      
      {settings.security.ipRestriction && (
        <Input
          label="Allowed IP Addresses (comma separated)"
          value={settings.security.allowedIPs}
          onChange={(e) => handleInputChange('security', 'allowedIPs', e.target.value)}
          placeholder="e.g., 192.168.1.1, 10.0.0.1"
        />
      )}
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="automaticBackup"
          checked={settings.backup.automaticBackup}
          onChange={() => handleCheckboxChange('backup', 'automaticBackup')}
          className="mr-2"
        />
        <label htmlFor="automaticBackup">Enable Automatic Backup</label>
      </div>
      
      {settings.backup.automaticBackup && (
        <>
          <Select
            label="Backup Frequency"
            value={settings.backup.backupFrequency}
            onChange={(e) => handleInputChange('backup', 'backupFrequency', e.target.value)}
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' }
            ]}
          />
          
          <Input
            label="Backup Time (HH:MM)"
            value={settings.backup.backupTime}
            onChange={(e) => handleInputChange('backup', 'backupTime', e.target.value)}
            type="time"
          />
        </>
      )}
      
      <Select
        label="Storage Location"
        value={settings.backup.storageLocation}
        onChange={(e) => handleInputChange('backup', 'storageLocation', e.target.value)}
        options={[
          { value: 'local', label: 'Local Storage' },
          { value: 'cloud', label: 'Cloud Storage' },
          { value: 'both', label: 'Both Local and Cloud' }
        ]}
      />
      
      <Input
        label="Retention Period (days)"
        value={settings.backup.retentionPeriod}
        onChange={(e) => handleInputChange('backup', 'retentionPeriod', e.target.value)}
        type="number"
        min="7"
        max="365"
      />
      
      <Button 
        label="Backup Now" 
        variant="secondary" 
        onClick={() => toast.info('Manual backup initiated')}
      />
    </div>
  );

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings for your organization</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation Tabs */}
          <div className="col-span-1">
            <Card>
              <ul className="divide-y divide-gray-200">
                {['general', 'email', 'notifications', 'security', 'backup'].map((tab) => (
                  <li key={tab}>
                    <button
                      className={`w-full text-left py-3 px-4 ${
                        currentTab === tab
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} Settings
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="col-span-1 md:col-span-3">
            <Card>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">
                  {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Settings
                </h2>
                {renderTabContent()}
                <div className="mt-6 flex justify-end">
                  <Button
                    label="Save Changes"
                    onClick={handleSaveSettings}
                    loading={saveLoading}
                    variant="primary"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Test Email Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Send Test Email"
      >
        <div className="p-4">
          <p className="mb-4">
            This will send a test email using the configured SMTP settings to verify your email configuration.
          </p>
          <Input
            label="Recipient Email"
            placeholder="Enter email address to receive test"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              label="Cancel"
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
            />
            <Button
              label="Send Test Email"
              onClick={sendTestEmail}
              variant="primary"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SystemSettings;