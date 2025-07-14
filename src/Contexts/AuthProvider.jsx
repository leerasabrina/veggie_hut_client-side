import React, { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import { auth } from '../firebase/firebase.init';
import Loader from '../Loader/Loader';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = 'https://server-side-nine-ruddy.vercel.app';

  const generateJWT = async (email) => {
    try {
      const res = await axios.post(`${baseURL}/jwt`, { email });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    } catch (err) {
      console.error("JWT generation failed:", err);
    }
  };

  const refreshJWT = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const res = await axios.post(`${baseURL}/jwt/refresh`, { refreshToken });
      const { accessToken } = res.data;
      localStorage.setItem('token', accessToken);
      return accessToken;
    } catch (err) {
      console.error("Refresh token failed:", err);
      logout();
      return null;
    }
  };

  const secureFetch = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    options.method = options.method || 'GET';
    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${token}`;

    try {
      return await axios(url, options);
    } catch (error) {
      if (error.response?.status === 403) {
        token = await refreshJWT();
        if (token) {
          options.headers.Authorization = `Bearer ${token}`;
          return await axios(url, options);
        }
      }
      throw error;
    }
  };

  const googleSignin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await generateJWT(user.email);
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'user',
    };

    try {
      await secureFetch(`${baseURL}/users/${user.email}`);
      setUser(newUser);
    } catch (err) {
      if (err.response?.status === 404) {
        await secureFetch(`${baseURL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: newUser,
        });
        setUser(newUser);
      } else {
        console.error("Google DB error:", err?.message);
        
        throw err;
      }
    }

   
    return result;
  } catch (err) {
    console.error("Google Sign-in failed:", err?.message);
   
    throw err;
  }
};
  const login = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await generateJWT(user.email);
    await fetchUserFromDB(user);
   
    return result;
  } catch (err) {
    console.error("Login failed:", err?.message);
    
    throw err;
  }
};

 const register = async (email, password, name, photo) => {
  if (
    password.length < 6 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    toast.error("Weak password: Use upper, lower, number, special chars.");
    throw new Error("Weak password");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name, photoURL: photo });
    await generateJWT(user.email);

    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: photo,
      role: 'user',
    };

    await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    await fetchUserFromDB(user);
    toast.success("Registration successful!");
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      toast.error("This email is already registered. Please login instead.");
    } else {
      toast.error("Registration failed: " + err.message);
    }
    console.error("Register error:", err);
    throw err;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    return signOut(auth);
  };

  const fetchUserFromDB = async (firebaseUser) => {
    if (!firebaseUser?.email) return setUser(null);
    try {
      const res = await secureFetch(`${baseURL}/users/${firebaseUser.email}`);
      if (res.status === 200 && res.data) {
        setUser(res.data);
      } else {
        console.warn("User fetch failed, status:", res.status);
        setUser(null);
      }
    } catch (err) {
      console.error("Fetch user from DB failed:", err?.response?.data || err.message);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        await generateJWT(currentUser.email);
        await fetchUserFromDB(currentUser);
      } else {
        logout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const userInfo = {
    user,
    setUser,
    login,
    register,
    logout,
    googleSignin,
    loading,
    secureFetch,
  };

  return (
    <AuthContext.Provider value={userInfo}>
      {!loading ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;