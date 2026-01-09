import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyAI9bhWH98vJfp5p_oNhc9WbiJBWi57dNU",
    authDomain: "no-ops-2026.firebaseapp.com",
    projectId: "no-ops-2026",
    storageBucket: "no-ops-2026.firebasestorage.app",
    messagingSenderId: "539346326616",
    appId: "1:539346326616:web:6b8134d4c5f70d2d08262d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};

export const checkAidAvailability = async (aid: string) => {
    const q = query(collection(db, "users"), where("aid", "==", aid.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
};

export const saveUserProfile = async (uid: string, data: any) => {
    try {
        await setDoc(doc(db, "users", uid), {
            ...data,
            createdAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error("Error saving user profile", error);
        throw error;
    }
};

export const getUserProfile = async (uid: string) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error("Error getting user profile", error);
        return null;
    }
};

export { db, auth, signInWithGoogle, logout };