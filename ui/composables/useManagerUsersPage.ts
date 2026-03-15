import type { UserRole } from '~/composables/useAuth'
import type { ManagerUser } from '~/composables/useManagerUsers'

export function useManagerUsersPage() {
  const { users, addUser, updateUser, deleteUser } = useManagerUsers()
  const showModal = ref(false)
  const editingId = ref<string | null>(null)
  const userToDelete = ref<ManagerUser | null>(null)
  const form = ref({ name: '', email: '', role: 'staff' as UserRole })
  const filterRole = ref('')

  function setFilterRole(value: string) {
    filterRole.value = value
  }

  const filteredUsers = computed(() => {
    const list = users.value
    if (!filterRole.value) return list
    return list.filter((u) => u.role === filterRole.value)
  })

  function roleBadgeClass(role: string) {
    if (role === 'admin') return 'bg-amber-100 text-amber-800'
    if (role === 'manager') return 'bg-palette-olive/80 text-palette-cream'
    return 'bg-palette-sage/90 text-palette-white'
  }

  function openAdd() {
    editingId.value = null
    form.value = { name: '', email: '', role: 'staff' }
    showModal.value = true
  }

  function openEdit(u: ManagerUser) {
    editingId.value = u.id
    form.value = { name: u.name, email: u.email, role: u.role }
    showModal.value = true
  }

  function saveUser() {
    if (editingId.value) {
      updateUser(editingId.value, { name: form.value.name, email: form.value.email, role: form.value.role })
    } else {
      addUser({ name: form.value.name, email: form.value.email, role: form.value.role })
    }
    showModal.value = false
  }

  function confirmDelete(u: ManagerUser) {
    userToDelete.value = u
  }

  function doDelete() {
    if (userToDelete.value) {
      deleteUser(userToDelete.value.id)
      userToDelete.value = null
    }
  }

  function clearUserToDelete() {
    userToDelete.value = null
  }

  function closeModal() {
    showModal.value = false
  }

  return {
    users,
    showModal,
    editingId,
    userToDelete,
    form,
    filterRole,
    filteredUsers,
    roleBadgeClass,
    openAdd,
    openEdit,
    saveUser,
    confirmDelete,
    doDelete,
    clearUserToDelete,
    closeModal,
    setFilterRole,
  }
}
