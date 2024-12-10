import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthContextType, UserProfile } from '../types/user';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            
            // Si le compte est suspendu, déconnecter l'utilisateur
            if (userData.isActive === false) {
              await firebaseSignOut(auth);
              setUser(null);
            } else {
              setUser({ ...userData, uid: firebaseUser.uid });
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, profile: Partial<UserProfile>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      const userProfile: UserProfile = {
        uid,
        email,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        birthDate: profile.birthDate || '',
        address: profile.address,
        postalCode: profile.postalCode,
        city: profile.city,
        phone: profile.phone,
        bio: profile.bio,
        gender: profile.gender || 'male',
        favoriteGenres: profile.favoriteGenres || [],
        emailVerified: false,
        isAdmin: profile.isAdmin || false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', uid), userProfile);
      await sendEmailVerification(userCredential.user);
      setUser(userProfile);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Essayer de se connecter avec Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Vérifier si l'utilisateur existe dans Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Si l'utilisateur n'existe pas dans Firestore, le déconnecter
        await firebaseSignOut(auth);
        throw new Error('NOT_REGISTERED');
      }

      const userData = userDoc.data() as UserProfile;
      
      // Vérifier si le compte est suspendu
      if (userData.isActive === false) {
        // Si le compte est suspendu, le déconnecter
        await firebaseSignOut(auth);
        throw new Error('ACCOUNT_SUSPENDED');
      }

      return userCredential.user;
    } catch (err: any) {
      // Gérer les différents cas d'erreur
      if (err.code === 'auth/user-not-found') {
        throw new Error('NOT_REGISTERED');
      }
      if (err.message === 'NOT_REGISTERED' || err.message === 'ACCOUNT_SUSPENDED') {
        throw err;
      }
      setError(err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const verifyEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });

      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser || !user) throw new Error('Utilisateur non connecté');

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    verifyEmail,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};