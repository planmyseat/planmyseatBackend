import { match } from 'path-to-regexp';

export const validateJsonOnly = (req, res, next) => {
  const contentType = req.headers['content-type'];

  const skipJsonValidationRoutes = [
    '/api/courses/:courseId/years',
  ];

  const shouldSkip = skipJsonValidationRoutes.some(pattern => {
    const isMatch = match(pattern, { decode: decodeURIComponent });
    return isMatch(req.path);
  });

  if (
    req.method === 'POST' &&
    !shouldSkip &&
    contentType &&
    !contentType.includes('application/json')
  ) {
    return res.status(400).json({ error: 'Server expects JSON data' });
  }

  next();
};
