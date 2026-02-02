import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashVaue = async (value: string) : Promise<string> => {
    return await bcrypt.hash(value, SALT_ROUNDS); 
};

export const compareValue = async (value: string, hash: string) : Promise<boolean> => {
    return await bcrypt.compare(value, hash);
};
