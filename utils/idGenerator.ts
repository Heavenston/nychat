let ALPHABET: string[] = []
{
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'

  ALPHABET.push(...alphabet.toLowerCase().split(''))
  ALPHABET.push(...alphabet.toUpperCase().split(''))
  ALPHABET.push(...numbers.split(''))
}

export function generateId(length: number = 15): string {
  let id = ''
  for (let i = 0; i < length; i++) {
    id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return id
}
