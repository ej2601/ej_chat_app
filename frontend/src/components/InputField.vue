<script setup>
defineProps({
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  error: String
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-4">
    <label class="block text-gray-700">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full p-2 border border-gray-300 rounded mt-1"
    />
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>
