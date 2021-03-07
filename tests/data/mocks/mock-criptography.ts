import { Hasher } from '@/data/protocols/criptography/hasher'
import { Decrypter, Encrypter } from '@/data/protocols/criptography'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'

export const mockHasher = (): Hasher => {
	class HasherStub {
		async hash (value: string): Promise<string> {
			return Promise.resolve('any_password')
		}
	}
	return new HasherStub()
}

export const mockDecrypter = (): Decrypter => {
	class DecrypterStub implements Decrypter {
			async decrypt (value: string): Promise<string> {
					return Promise.resolve('any_value')
			}
	}
	return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt (id: string): Promise<string> {
			return Promise.resolve('any_token')
		}
	}
	return new EncrypterStub()
}

export const mockHashComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare (value: string, hash: string): Promise<boolean> {
			return Promise.resolve(true)
		}
	}
	return new HashComparerStub()
}
