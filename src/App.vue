<script setup lang="ts">
import { romajiCharacters } from '@/helper/romajiCharacters';
import { useAttentionalBlinkStore } from '@/store/store.ts';

useAttentionalBlinkStore();
</script>

<template>
  <div class="text-hidden">
    <span>・</span>
    <span v-for="character in romajiCharacters" v-once>
      {{ character }}
    </span>
  </div>
  <router-view />
</template>

<style scoped lang="scss">
.text-hidden {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
