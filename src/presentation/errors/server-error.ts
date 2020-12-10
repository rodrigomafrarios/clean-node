export class ServerError extends Error {
	constructor (stack: undefined | string) {
		super('Internal server error')
		this.name = 'ServerError'
		this.stack = stack
	}
}
