export default function validateEmptyField(field: string): boolean {
  if (!field) {
    return false
  }

  return true
}

export function validateEmptyFields(fields: string[]): boolean {
  let valid = true

  fields.map(item => {
    if (!validateEmptyField(item)) {
      valid = false
    }
  })

  return valid
}
