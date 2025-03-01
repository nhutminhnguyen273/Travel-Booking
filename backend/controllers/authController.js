const AuthService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const user = await AuthService.register(req.body);
            res.status(200).json({
                message: "Đăng ký thành công",
                data: user
            });
        }catch(err) {
            res.status(500).json({
                message: "Lỗi khi đăng ký",
                error: err.message
            });
        }
    }

    async login(req, res) {
        try {
            const user = await AuthService.login(req.body.username, req.body.password, res);
            res.status(200).json({
                message: "Đăng nhập thành công",
                data: user
            });
        } catch(err) {
            res.status(500).json({
                message: "Lỗi khi đăng nhập",
                error: err.message
            });
        }
    }

    async refreshToken(req, res) {
        try {
            const token = await AuthService.requestRefreshToken(req);
            res.status(200).json({
                message: "Refresh thành công",
                data: token
            });
        }catch(err) {
            res.status(500).json({
                message: "Lỗi khi refresh",
                error: err.message
            });
        }
    }

    async logout(req, res) {
        try {
            res.status(200).json(await AuthService.logout(req, res));
        }catch(err) {
            res.status(500).json({
                message: "Lỗi khi đăng xuất",
                error: err.message
            });
        }
    }
}
module.exports = new AuthController();