// Company validation
export const validateCompanyData = (data) => {
  const errors = []

  // Validate company name
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Company name is required and must be a string')
  } else if (data.name.length < 2 || data.name.length > 100) {
    errors.push('Company name must be between 2 and 100 characters')
  }

  // Validate address
  if (!data.address || typeof data.address !== 'string') {
    errors.push('Address is required and must be a string')
  } else if (data.address.length < 10 || data.address.length > 200) {
    errors.push('Address must be between 10 and 200 characters')
  }

  // Validate phone number
  if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
    errors.push('Phone number is required and must be a string')
  } else {
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(data.phoneNumber) || data.phoneNumber.length < 10 || data.phoneNumber.length > 15) {
      errors.push('Phone number must be a valid format with 10-15 digits')
    }
  }

  // Validate land phone
  if (!data.landPhone || typeof data.landPhone !== 'string') {
    errors.push('Land phone is required and must be a string')
  } else {
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(data.landPhone) || data.landPhone.length < 10 || data.landPhone.length > 15) {
      errors.push('Land phone must be a valid format with 10-15 digits')
    }
  }

  // Validate geo location
  if (!data.geoLocation || typeof data.geoLocation !== 'string') {
    errors.push('Geo location is required and must be a string')
  } else if (data.geoLocation.length < 5 || data.geoLocation.length > 100) {
    errors.push('Geo location must be between 5 and 100 characters')
  }

  return { isValid: errors.length === 0, errors }
}
