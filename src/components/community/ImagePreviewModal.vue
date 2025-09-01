<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    @click="$emit('close')"
  >
    <div class="max-h-4xl max-w-4xl p-4" @click.stop>
      <img
        :src="url"
        :alt="name"
        class="max-h-full max-w-full rounded-lg object-contain"
      />
      <div class="mt-4 text-center">
        <p class="text-sm text-white">{{ name }}</p>
        <button
          class="mt-2 text-white hover:text-gray-300"
          @click="$emit('close')"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({ show: Boolean, url: String, name: String });
defineEmits(['close']);
</script>
