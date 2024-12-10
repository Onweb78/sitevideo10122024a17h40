import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ContactCategory, EmailConfig, ContactMessage } from '../types/contact';

class ContactService {
  async getCategories(): Promise<ContactCategory[]> {
    const snapshot = await getDocs(collection(db, 'contactCategories'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ContactCategory));
  }

  async createCategory(category: Omit<ContactCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const docRef = doc(collection(db, 'contactCategories'));
    await setDoc(docRef, {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async updateCategory(id: string, data: Partial<ContactCategory>): Promise<void> {
    const docRef = doc(db, 'contactCategories', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, 'contactCategories', id));
  }

  async getEmailConfigs(): Promise<EmailConfig[]> {
    const snapshot = await getDocs(collection(db, 'emailConfigs'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EmailConfig));
  }

  async createEmailConfig(config: Omit<EmailConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const docRef = doc(collection(db, 'emailConfigs'));
    await setDoc(docRef, {
      ...config,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async updateEmailConfig(id: string, data: Partial<EmailConfig>): Promise<void> {
    const docRef = doc(db, 'emailConfigs', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  }

  async deleteEmailConfig(id: string): Promise<void> {
    await deleteDoc(doc(db, 'emailConfigs', id));
  }

  async sendContactMessage(message: Omit<ContactMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const docRef = doc(collection(db, 'contactMessages'));
    await setDoc(docRef, {
      ...message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

export const contactService = new ContactService();