import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCkeQ24uVuiJ6BwLaCHKoVbBO5HLy-AL5Y",
    authDomain: "gggg-7e510.firebaseapp.com",
    projectId: "gggg-7e510",
    storageBucket: "gggg-7e510.firebasestorage.app",
    messagingSenderId: "830715367124",
    appId: "1:830715367124:web:ce9b2eb98d15a49458b541",
    measurementId: "G-1000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create Google provider instance
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        return await signInWithPopup(auth, googleProvider);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Sign in with email and password
export const logInWithEmailAndPassword = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Register with email and password
export const registerWithEmailAndPassword = async (email, password) => {
    try {
        return await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Sign out
export const logOut = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

// Auth state listener
export const onAuthStateChangedListener = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Export auth for direct access if needed
export { auth };
export default app; 