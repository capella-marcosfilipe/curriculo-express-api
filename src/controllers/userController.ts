import { Request, Response } from 'express';


/**
 * @desc    Busca os dados do usuário logado
 * @route   GET /api/users/me
 * @access  Privado (Protegido por JWT)
 */
export const getMe = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};