export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Не авторизований",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Немає доступу",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: "Помилка перевірки ролі",
        error: error.message,
      });
    }
  };
};
