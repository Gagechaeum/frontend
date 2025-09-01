<script setup>
import BusinessItem from './BusinessItem.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update', 'remove']);

function updateAt(idx, v) {
  const copy = [...props.items];
  copy[idx] = v;
  emit('update', copy);
}
function removeAt(idx) {
  const copy = [...props.items];
  copy.splice(idx, 1);
  emit('update', copy);
  emit('remove', idx);
}
</script>

<template>
  <div>
    <BusinessItem
      v-for="(b, i) in props.items"
      :key="b.id"
      :model-value="b"
      @update:model-value="v => updateAt(i, v)"
      @remove="removeAt(i)"
    />
  </div>
</template>
