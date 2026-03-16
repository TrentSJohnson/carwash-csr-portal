import { useState } from 'react'

export default function useFormModal(initialForm, onSubmit) {
  const [form, setForm]     = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState(null)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErr(null)
    try {
      await onSubmit(form)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return { form, setForm, saving, err, handleChange, handleSubmit }
}
