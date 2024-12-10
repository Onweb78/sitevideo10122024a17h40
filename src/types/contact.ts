export interface ContactCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailConfig {
  id: string;
  category: string;
  recipientEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  useTLS: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  category: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'sent' | 'error';
  createdAt: Date;
  updatedAt: Date;
}