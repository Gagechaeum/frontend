<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
    @click="$emit('close')"
  >
    <div
      class="mx-4 w-[580px] rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
      @click.stop
    >
      <div class="relative p-12">
        <div class="absolute right-6 top-6">
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="$emit('close')"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="text-center">
          <div class="relative mb-8">
            <div
              class="mx-auto flex h-24 w-24 rotate-12 transform items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"
            >
              <i
                class="fas fa-comments -rotate-12 transform text-4xl text-white"
              ></i>
            </div>
            <div
              class="absolute -bottom-2 -right-2 flex h-8 w-8 rotate-12 transform items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-500"
            >
              <i
                class="fas fa-plus -rotate-12 transform text-sm text-white"
              ></i>
            </div>
          </div>
          <h3 class="mb-4 text-3xl font-bold text-gray-800">새로운 채팅방</h3>
          <p class="mb-2 text-xl leading-relaxed text-gray-600">
            {{ room?.name }}
          </p>
          <div
            class="inline-flex items-center space-x-2 rounded-full bg-blue-50 px-4 py-2"
          >
            <i class="fas fa-users text-blue-500"></i>
            <p class="text-blue-600">
              현재
              <span class="font-semibold">{{ room?.memberCount }}명</span>
              참여중
            </p>
          </div>
        </div>
        <div class="mt-10">
          <button
            class="!rounded-button mb-3 w-full transform whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-4 text-lg font-semibold text-white shadow-[0_10px_25px_-12px_rgba(59,130,246,0.5)] transition-all duration-200 hover:translate-y-[-2px] hover:from-blue-600 hover:to-blue-700"
            @click="$emit('confirm')"
          >
            채팅방 입장하기
          </button>
          <button
            class="!rounded-button w-full whitespace-nowrap rounded-xl bg-gray-50 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-100"
            @click="$emit('close')"
          >
            다음에 할게요
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean, room: { type: Object, default: null } });
defineEmits(['close', 'confirm']);
</script>
<style scoped>
.\!rounded-button {
  border-radius: 12px !important;
}
</style>
