import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ad } from '../types/ad';

class AdService {
  private collection = 'ads';

  async createAd(ad: Omit<Ad, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const docRef = doc(collection(db, this.collection));
    await setDoc(docRef, {
      ...ad,
      startDate: Timestamp.fromDate(new Date(ad.startDate)),
      endDate: Timestamp.fromDate(new Date(ad.endDate)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }

  async updateAd(adId: string, updates: Partial<Ad>): Promise<void> {
    const adRef = doc(db, this.collection, adId);
    const updateData: any = { ...updates, updatedAt: Timestamp.now() };
    
    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(new Date(updates.startDate));
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(new Date(updates.endDate));
    }
    
    await updateDoc(adRef, updateData);
  }

  async deleteAd(adId: string): Promise<void> {
    await deleteDoc(doc(db, this.collection, adId));
  }

  async getAd(adId: string): Promise<Ad | null> {
    const adRef = doc(db, this.collection, adId);
    const adDoc = await getDoc(adRef);
    
    if (!adDoc.exists()) {
      return null;
    }

    const data = adDoc.data();
    return {
      id: adDoc.id,
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Ad;
  }

  async getAllAds(): Promise<Ad[]> {
    const adsRef = collection(db, this.collection);
    const snapshot = await getDocs(adsRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Ad;
    });
  }

  async getActiveAd(): Promise<Ad | null> {
    try {
      const now = Timestamp.now();
      const adsRef = collection(db, this.collection);
      
      // Récupérer toutes les publicités actives
      const q = query(
        adsRef,
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      // Filtrer et trier les publicités en mémoire
      const validAds = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          } as Ad;
        })
        .filter(ad => {
          const nowDate = now.toDate();
          return ad.startDate <= nowDate && ad.endDate >= nowDate;
        })
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

      return validAds[0] || null;
    } catch (error) {
      console.error('Error getting active ad:', error);
      return null;
    }
  }
}

export const adService = new AdService();