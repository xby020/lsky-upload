import { createApp } from 'vue';
import App from './App.vue';
import './main.css';
import 'virtual:uno.css';
import router from './routes';
import { MotionPlugin } from '@vueuse/motion';

const app = createApp(App);

app.use(router);
app.use(MotionPlugin);

app.mount('#app');
