<template>
  <footer class="mt-16 border-t border-gray-200 bg-white">
    <div class="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3">
      <section>
        <slot name="brand">
          <h3 class="mb-2 font-semibold text-gray-900">가게채움</h3>
          <p class="text-sm text-gray-600">
            정부 지원/대출/정책 정보를 한 곳에서!
          </p>
        </slot>
      </section>
      <section>
        <h4 class="mb-2 font-medium text-gray-900">링크</h4>
        <ul class="space-y-1 text-sm">
          <slot name="links">
            <li><a href="/schedule" class="hover:text-primary">일정</a></li>
            <li><a href="/mypage" class="hover:text-primary">내 서류함</a></li>
            <li>
              <a href="/community" class="hover:text-primary">커뮤니티</a>
            </li>
          </slot>
        </ul>
      </section>
      <section class="md:text-right">
        <slot name="legal">
          <p class="text-xs text-gray-500">
            © 2025 Gagechaeum. All rights reserved.
          </p>
        </slot>
      </section>
    </div>
  </footer>
</template>

<script setup></script>
