import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // GitHub Pages 배포 시 에셋 경로가 깨지지 않도록 상대 경로로 빌드합니다.
});
