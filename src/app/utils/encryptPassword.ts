import { genSaltSync, hashSync, compareSync } from "bcryptjs"

export const encryptPassword = (plain: string): string => {
	let salt = genSaltSync(10)
	let hash = hashSync(plain, salt)

	return hash
}

export const validatePassword = (plain: string, encrypted: string): boolean => {
    return Boolean(compareSync(plain, encrypted) === true)
}
