import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Page {
  id: string;
  title: string;
  path: string;
  content: string;
  lastModified: Date;
  location?: 'navbar' | 'footer' | 'none';
  column?: 'films' | 'series' | 'pages' | 'legal' | 'none';
  isVisible?: boolean;
}

class PageService {
  private collection = 'pages';

  async createPage(page: Omit<Page, 'lastModified'>): Promise<void> {
    const pageRef = doc(db, this.collection, page.id);
    await setDoc(pageRef, {
      ...page,
      lastModified: new Date()
    });
  }

  async updatePage(pageId: string, updates: Partial<Page>): Promise<void> {
    const pageRef = doc(db, this.collection, pageId);
    await updateDoc(pageRef, {
      ...updates,
      lastModified: new Date()
    });
  }

  async getPage(pageId: string): Promise<Page | null> {
    const pageRef = doc(db, this.collection, pageId);
    const pageDoc = await getDoc(pageRef);
    
    if (!pageDoc.exists()) {
      return null;
    }

    return {
      id: pageDoc.id,
      ...pageDoc.data()
    } as Page;
  }

  async getAllPages(): Promise<Page[]> {
    const pagesRef = collection(db, this.collection);
    const snapshot = await getDocs(pagesRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Page[];
  }

  async getPagesByLocation(location: 'navbar' | 'footer'): Promise<Page[]> {
    try {
      const pagesRef = collection(db, this.collection);
      const q = query(
        pagesRef, 
        where('location', '==', location),
        where('isVisible', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Page[];
    } catch (error) {
      console.error('Error in getPagesByLocation:', error);
      return [];
    }
  }

  async updatePageContent(pageId: string, content: string): Promise<void> {
    const pageRef = doc(db, this.collection, pageId);
    await updateDoc(pageRef, {
      content,
      lastModified: new Date()
    });
  }

  async getVisiblePages(): Promise<Page[]> {
    const pagesRef = collection(db, this.collection);
    const q = query(pagesRef, where('isVisible', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Page[];
  }
}

export const pageService = new PageService();