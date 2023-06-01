import { defineConfig } from 'unocss';
import { presetWind } from 'unocss';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      cdn: 'https://esm.sh/',
    }),
  ],
});
