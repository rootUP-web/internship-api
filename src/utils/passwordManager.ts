import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string>
{
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function checkPassword(plainPassword: string, hashedPassword: string): Promise<Boolean>
{
    return bcrypt.compare(plainPassword, hashedPassword);
}