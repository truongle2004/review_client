export function removeBrackets(input: string): string {
  return input.replace(/^\[|\]$/g, '');
}
