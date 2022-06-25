function getNow(): number {
	return Math.floor(Date.now() / 1000)
}

function generateRandomString(): string {
	return Math.random().toString(36).slice(2)
}

export { getNow, generateRandomString }
