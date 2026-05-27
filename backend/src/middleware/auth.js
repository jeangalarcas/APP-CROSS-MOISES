import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Acesso negado. Privilégios de administrador necessários.' });
  }
  next();
}

export function studentMiddleware(req, res, next) {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Acesso negado. Apenas alunos podem acessar.' });
  }
  next();
}
