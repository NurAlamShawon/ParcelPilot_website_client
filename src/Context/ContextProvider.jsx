import React, { useEffect, useState } from "react";
import { ValueContext } from "./ValueContext";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../src/firebase-init";
import { GithubAuthProvider } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";




const fetchbooks = async () => {
  const res = await fetch("https://library-management-website-server.vercel.app/books");
  return res.json();
};



const ContextProvider = ({ children }) => {




  const [books, setbooks] = useState([]);
 

  useEffect(() => {
    fetchbooks().then((data) => setbooks(data));
  }, []);




  const [loading, setloading] = useState(true);
  const [currentuser, setcurrentuser] = useState(null);

  const signupwithgoogle = () => {
    setloading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signupwithgithub = () => {
    setloading(true);
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signupwithemail = (email, password) => {
    setloading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginwithemail = (email, password) => {
    setloading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signout = () => {
    setloading(true);
    return signOut(auth);
  };

  const resetpassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user)
        setcurrentuser(user);
        setloading(false);
      } else {
        setcurrentuser(null);
        setloading(false);
      }
    });

    return () => {
      unsubscribe(); //its mean when the useEffect load data it will clean after load data
    };
  }, []);

  const userinfo = {
    books,
    signupwithgoogle,
    signupwithgithub,
    signupwithemail,
    loginwithemail,
    loading,
    currentuser,
    signout,
    resetpassword,
  };

  return (
    <div>
      <ValueContext.Provider value={userinfo}>{children}</ValueContext.Provider>
    </div>
  );
};

export default ContextProvider;
