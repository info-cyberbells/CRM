const roleGuard = (allowedRole) => {
    return (req, res, next) => {
        if (req.user.role !== allowedRole) {
            return res.status(403).json({
                message: "Forbidden: Access denied",
            });
        }
        next();
    };
};

export default roleGuard;
