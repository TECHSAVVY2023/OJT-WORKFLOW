<template>
  <div class="min-h-screen flex">
    <LoginFormPanel
      :background="loginData.background"
      :login-error="loginError"
      v-model:email="email"
      v-model:password="password"
      v-model:remember="remember"
      v-model:show-password="showPassword"
      @submit="onSubmitClick"
    />
    <LoginBrandingPanel :branding="loginData.branding" />
    <ConfirmModal
      v-model="showLoginConfirm"
      title="Sign in?"
      message="Are you sure you want to sign in with this account?"
      confirm-label="Yes, sign in"
      cancel-label="Cancel"
      @confirm="doSubmit"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'login' })

const {
  loginData,
  email,
  password,
  remember,
  showPassword,
  loginError,
  showLoginConfirm,
  onSubmitClick,
  doSubmit,
} = useLoginPage()
</script>
