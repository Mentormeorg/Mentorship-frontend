export const environment = {
  firebase: {
    projectId: 'mentorchief-383902',
    appId: '1:263225123218:web:bddd2d697a489b2e62a14b',
    storageBucket: 'mentorchief-383902.appspot.com',
    apiKey: 'AIzaSyBFIkzqnK-UukVZ2NoGI8gnAil4UZBgZy4',
    authDomain: 'mentorchief-383902.firebaseapp.com',
    messagingSenderId: '263225123218',
    measurementId: 'G-DRJXKHVEVJ',
  },
  skillsAndTitle: {
    client_ID: '2oap3fo8yv8a6z13',
    secret: '5IlyoY3D',
    Scope: 'emsi_open',
  },
  production: false,
  // ! Add base url here / backend localhost server
  baseUrl: 'http://localhost:3000/api/v1',
  title: '[DEV] MentorChief',
  backend: {
    type: 'supabase' as 'supabase' | 'rest',
  },
  supabase: {
		url: 'https://ozcodcbhbyhjbadifaco.supabase.co',
		anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y29kY2JoYnloamJhZGlmYWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0Mjc1OTAsImV4cCI6MjA3ODAwMzU5MH0.g2S_eMDW_CywF0bSC2YekH21HcX9JJ_kizpWnCgB0nQ',
		redirectUrl: ' https://ozcodcbhbyhjbadifaco.supabase.co/auth/v1/callback',
  },
};
