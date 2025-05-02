import { createApp } from 'vue'
import App from './App.vue'

import { createVuetify } from 'vuetify';
import 'vuetify/styles';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import "@mdi/font/css/materialdesignicons.css";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD4KwqbI3feD_F7JruVLQL1xIUkhU2Ul3k",
    authDomain: "poker-adebb.firebaseapp.com",
    projectId: "poker-adebb",
    storageBucket: "poker-adebb.firebasestorage.app",
    messagingSenderId: "708726946167",
    appId: "1:708726946167:web:2f29f4fab71b80706c4972"
  };

const vuetify = createVuetify({
    components,
    directives,
});

const app = createApp(App);
const firebaseApp = initializeApp(firebaseConfig);

app.use(vuetify); 
app.mount('#app');
