const AuthService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const user = await AuthService.register(req.body, res);
            res.status(200).json({
                message: "Register successfully",
                data: user
            });
        } catch (err) {
            res.status(500).json({
                message: "Error",
                error: err.message
            });
        }
    }

    async login(req, res) {
        try {
            const user = await AuthService.login(req.body.username, req.body.password, res);
            res.status(200).json({
                message: "Login successfully",
                data: user
            });
        } catch (err) {
            res.status(500).json({
                message: "Error",
                error: err.message
            });
        }
    }

    async logout(req, res) {
        try {
            res.status(200).json(await AuthService.logout(req, res));
        } catch (err) {
            res.status(500).json({
                message: "Error",
                error: err.message
            });
        }
    }
}
module.exports = new AuthController();