import React, { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import { auth } from '../firebase/firebase.init';
import Loader from '../Loader/Loader';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const googleSignin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const token = await user.getIdToken();
  localStorage.setItem('token', token);

  const newUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: 'user',
  };

  
  const res = await fetch(`https://server-side-nine-ruddy.vercel.app/users/${user.email}`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 404) {
    // 🔵 User not found — create new one
    await fetch('https://server-side-nine-ruddy.vercel.app/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });

    setUser(newUser);
    console.log('New user added:', newUser);
  } else if (res.ok) {
    // 🟣 Existing user found — use that
    const existingUser = await res.json();
    setUser(existingUser);
    console.log('Existing user loaded:', existingUser);
  } else {
    // ❗ Something went wrong
    console.error('User fetch error:', res.status);
  }

  return result;
};


  // Email/password login
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();

    localStorage.setItem('token', token);

    return result;
  };

  // Register new user
  const resister = (email, password, name, photo) => {
    if (password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("Password must be at least 6 characters and include uppercase, lowercase, number, and special character");
      return Promise.reject(new Error("Password does not meet criteria"));
        }

  return createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    await updateProfile(userCredential.user, {
      displayName: name,
      photoURL: photo,
    });

   
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token); 
    

    const newUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name,
      photoURL: photo,
      role: 'user',
    };

    
    await fetch('https://server-side-nine-ruddy.vercel.app/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newUser),
    });
  

await fetchUserFromDB(auth.currentUser);
    // setUser(newUser);
  });
  }

 
  const logout = () => {   
    localStorage.removeItem('token');
    setUser(null);
    return signOut(auth);
  };

 

  const fetchUserFromDB = async (firebaseUser) => {
  if (!firebaseUser?.email) {
    setUser(null);
    return;
  }
  let token;
  try {
    token = await firebaseUser.getIdToken();
    // console.log("Token from Firebase:", token);
  } catch (tokenError) {
    console.error("Failed to get ID token:", tokenError);
    setUser(null);
    return;
  }

  try {
    const res = await fetch(`https://server-side-nine-ruddy.vercel.app/users/${firebaseUser.email}`, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 404) {
      console.warn("User not found in database.");
      setUser(null);
      return;
    }

    const data = await res.json();
    setUser(data || null);
  } catch (error) {
    console.error("Failed to fetch user from database", error);
    setUser(null);
  }
};


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const token = await currentUser.getIdToken();  
      localStorage.setItem('token', token);

      await fetchUserFromDB(currentUser); 

    } else {
      localStorage.removeItem('token');
      setUser(null);
    }

    setLoading(false); 
  });

  return () => unsubscribe();
}, []);






  const userInfo = {
    user,
    setUser,
    login,
    resister,
    logout,
    googleSignin,
    loading,
  };

  return (
    <AuthContext.Provider value={userInfo}>
      {!loading ? children : <Loader></Loader>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
