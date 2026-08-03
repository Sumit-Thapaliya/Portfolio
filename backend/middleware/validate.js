/**
 * Generic Zod-schema validation middleware.
 * Runs before the controller so controllers never touch unvalidated input.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return res.status(400).json({
        success: false,
        message: firstIssue?.message || 'Invalid request data',
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
}
