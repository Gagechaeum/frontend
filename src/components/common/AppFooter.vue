<template>
  <footer
    class="border-gray-00 relative mt-12 overflow-hidden border-t bg-gray-100"
  >
    <!-- 배경 장식 요소 -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(
            circle at 1px 1px,
            rgb(148 163 184) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        "
      ></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-6 py-8">
      <!-- 메인 푸터 콘텐츠 -->
      <div class="grid gap-6 md:grid-cols-4 lg:gap-8">
        <!-- 브랜드 섹션 -->
        <section class="md:col-span-2">
          <slot name="brand">
            <h3
              class="mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold text-transparent"
            >
              가게채움
            </h3>
            <p class="mb-4 max-w-md text-sm leading-relaxed text-slate-600">
              정부 지원/대출/정책 정보를 한 곳에서!
              <span class="font-medium text-slate-700"
                >더 나은 비즈니스를 위한 모든 정보</span
              >
            </p>
          </slot>
        </section>

        <!-- 빠른 링크 -->
        <section>
          <h4 class="mb-3 text-base font-semibold text-slate-800">빠른 링크</h4>
          <ul class="space-y-2">
            <slot name="links">
              <li>
                <a
                  href="/schedule"
                  class="group flex items-center text-sm text-slate-600 transition-colors duration-200 hover:text-blue-600"
                >
                  <i
                    class="fas fa-calendar mr-2 text-xs transition-transform duration-200 group-hover:translate-x-1"
                  ></i>
                  일정
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  class="group flex items-center text-sm text-slate-600 transition-colors duration-200 hover:text-blue-600"
                >
                  <i
                    class="fas fa-folder mr-2 text-xs transition-transform duration-200 group-hover:translate-x-1"
                  ></i>
                  내 서류함
                </a>
              </li>
              <li>
                <a
                  href="/report"
                  class="group flex items-center text-sm text-slate-600 transition-colors duration-200 hover:text-blue-600"
                >
                  <i
                    class="fas fa-chart-bar mr-2 text-xs transition-transform duration-200 group-hover:translate-x-1"
                  ></i>
                  리포트
                </a>
              </li>
              <li>
                <a
                  href="/community"
                  class="group flex items-center text-sm text-slate-600 transition-colors duration-200 hover:text-blue-600"
                >
                  <i
                    class="fas fa-users mr-2 text-xs transition-transform duration-200 group-hover:translate-x-1"
                  ></i>
                  커뮤니티
                </a>
              </li>
            </slot>
          </ul>
        </section>

        <!-- 연락처 및 법적 정보 -->
        <section>
          <h4 class="mb-3 text-base font-semibold text-slate-800">연락처</h4>
          <div class="space-y-2 text-xs text-slate-600">
            <div class="flex items-center">
              <i class="fas fa-phone mr-2 text-xs text-blue-600"></i>
              <span>1588-1234</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-envelope mr-2 text-xs text-blue-600"></i>
              <span>support@gagechaeum.com</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt mr-2 text-xs text-blue-600"></i>
              <span>서울특별시 강남구</span>
            </div>
          </div>
        </section>
      </div>

      <!-- 구분선 -->
      <div class="mt-8 border-t border-gray-200 pt-6">
        <div
          class="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0"
        >
          <slot name="legal">
            <p class="text-xs text-slate-500">
              © 2025
              <span class="font-medium text-slate-600">Gagechaeum</span>. All
              rights reserved.
            </p>
          </slot>
          <div class="flex space-x-4 text-xs">
            <a
              href="#"
              class="text-slate-500 transition-colors duration-200 hover:text-slate-700"
              >개인정보처리방침</a
            >
            <a
              href="#"
              class="text-slate-500 transition-colors duration-200 hover:text-slate-700"
              >이용약관</a
            >
            <a
              href="#"
              class="text-slate-500 transition-colors duration-200 hover:text-slate-700"
              >고객센터</a
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>
