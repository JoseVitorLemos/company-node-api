export function removeSymbols (value: string): string {
	return value.replace(/[^\w\s]/gi, '')
}
