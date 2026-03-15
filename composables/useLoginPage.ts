import loginPageData from '~/data/login-page.json'

export type LoginPageData = {
  background: { image: string; alt: string }
  branding: {
    logo: { type: string; url: string; imageAlt: string }
    welcomeTitle: string
    tagline: string
    taglineHighlight: string
    panelBackgroundColor: string
    logoCircleColor: string
    highlightColor: string
  }
}

const REMEMBER_KEY = 'workflow_remembered_email'

export function useLoginPage() {
  const loginData = loginPageData as LoginPageData

  const email = ref('')
  const password = ref('')
  const remember = ref(false)
  const showPassword = ref(false)
  const loginError = ref('')
  const showLoginConfirm = ref(false)

  const { login } = useAuth()
  const router = useRouter()

  onMounted(() => {
    if (import.meta.client && typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(REMEMBER_KEY)
        if (saved) {
          const data = JSON.parse(saved) as { email?: string }
          if (data?.email) {
            email.value = data.email
            remember.value = true
          }
        }
      } catch (_) {
        // ignore invalid stored data
      }
    }
  })

  function onSubmitClick() {
    showLoginConfirm.value = true
  }

  function doSubmit() {
    loginError.value = ''
    if (import.meta.client && typeof localStorage !== 'undefined') {
      if (remember.value && email.value) {
        localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email: email.value }))
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
    }
    const result = login(email.value, password.value)
    if (result.success && result.role) {
      if (result.role === 'admin') router.push('/admin')
      else if (result.role === 'staff') router.push('/staff')
      else if (result.role === 'manager') router.push('/manager')
    } else {
      loginError.value = 'Invalid email or password. Demo: admin@workflow.com, staff@workflow.com, manager@workflow.com / password'
    }
  }

  return {
    loginData,
    email,
    password,
    remember,
    showPassword,
    loginError,
    showLoginConfirm,
    onSubmitClick,
    doSubmit,
  }
}
