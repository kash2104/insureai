import { useState } from 'react'
import './App.css'
import { useGoogleLogin } from '@react-oauth/google'
import { motion } from 'framer-motion';
import { AuroraBackground } from './components/ui/aurorabackground';
import { TextGenerateEffect } from './components/ui/textgenerate';
import { useNavigate } from 'react-router';

function App() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        // console.log('Access Token:', tokenResponse.access_token);
        const accessToken = tokenResponse.access_token;
          const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userInfo = await response.json();
          console.log('User Info:', userInfo);
          localStorage.setItem('task_id', userInfo.id); 
           

          const result = await fetch('http://localhost:4000/api/v1/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`, 
            },
            credentials: 'include', 
            body: JSON.stringify({
              id: userInfo.id, 
              email: userInfo.email, 
            }),
          })
          if(result.ok){
            navigate('/upload');
          }
          // console.log(result);
          // userInfo.data.id is the Google user ID you're looking for
      } 
      catch (err) {
          console.error('Failed to fetch user info:', err);
      }
    },
    onError: () => {
      console.log('Login Failed');
    },
    scope: 'openid profile email https://www.googleapis.com/auth/userinfo.profile', 
  });
  return (
    <>
      <AuroraBackground>

      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 min-h-screen text-center"
      >
        <div className="text-3xl md:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug">
          <TextGenerateEffect words={"Welcome to Medico AI"} />
        </div>
        <div className="font-extralight text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl py-4">
          <TextGenerateEffect words={"Easily upload your policy and discover smarter, more affordable coverage."} delay={0.2} />
        </div>
        
        <motion.button
          onClick={() => login()}
          className="px-8 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transform transition-transform duration-200 ease-in-out cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          Sign in with Google 
        </motion.button>
      </motion.div>

      </AuroraBackground>
    </>
  )
}

export default App
