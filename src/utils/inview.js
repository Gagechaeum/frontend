export const vInview = {
  mounted(el, binding) {
    const once =
      typeof binding.value === 'object' ? !!binding.value.once : true;

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('inview');
            if (once) io.unobserve(el);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    io.observe(el);
  },
};
