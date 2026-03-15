<template>
  <div class="relative flex-1 min-h-screen flex items-center justify-center px-8 py-12 overflow-hidden">
    <!-- Blurred background image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url('${background.image}')`, filter: 'blur(8px)', transform: 'scale(1.05)' }"
      aria-hidden="true"
    />
    <div class="absolute inset-0 bg-white/60" aria-hidden="true" />
    <!-- Form content -->
    <div class="relative z-10 w-full max-w-md">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm font-medium text-palette-brown/80 hover:text-palette-brown mb-6 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to home
      </NuxtLink>
      <h1 class="font-heading text-3xl md:text-4xl font-bold text-palette-brown mb-1">
        Welcome Back
      </h1>
      <p class="text-palette-brown/80 text-base mb-8">
        Sign in to Workflow Coworking Space
      </p>
      <p v-if="loginError" class="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
        {{ loginError }}
      </p>
      <form class="space-y-5" @submit.prevent="$emit('submit')">
        <div>
          <label for="login-email" class="block text-sm font-medium text-palette-brown mb-2">
            Email Address
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-palette-brown/70" aria-hidden="true">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              id="login-email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="w-full pl-12 pr-4 py-3 rounded-full border border-palette-olive/40 bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:outline-none focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage transition"
              required
            />
          </div>
        </div>
        <div>
          <label for="login-password" class="block text-sm font-medium text-palette-brown mb-2">
            Password
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-palette-brown/70" aria-hidden="true">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full pl-12 pr-12 py-3 rounded-full border border-palette-olive/40 bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:outline-none focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage transition"
              required
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 text-palette-brown/60 hover:text-palette-brown focus:outline-none focus-visible:ring-2 focus-visible:ring-palette-sage/50 focus-visible:ring-offset-1 rounded"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :title="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <input
            id="login-remember"
            v-model="remember"
            type="checkbox"
            class="w-4 h-4 rounded border-palette-olive/50 text-palette-sage focus:ring-palette-sage"
          />
          <label for="login-remember" class="text-sm text-palette-brown">Remember me</label>
        </div>
        <button
          type="submit"
          class="w-full py-3.5 rounded-full font-semibold text-palette-cream bg-palette-brown hover:bg-palette-olive focus:outline-none focus:ring-2 focus:ring-palette-olive/50 focus:ring-offset-2 transition flex items-center justify-center gap-2"
        >
          Login
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginPageData } from '~/composables/useLoginPage'

defineProps<{
  background: LoginPageData['background']
  loginError: string
}>()

const email = defineModel<string>('email', { default: '' })
const password = defineModel<string>('password', { default: '' })
const remember = defineModel<boolean>('remember', { default: false })
const showPassword = defineModel<boolean>('showPassword', { default: false })

defineEmits<{ submit: [] }>()
</script>
