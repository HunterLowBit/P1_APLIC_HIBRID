const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

// Rota protegida que requer autenticação
router.get("/protected-route", requireAuth, (req, res) => {
  // Esta rota só será acessível se o usuário estiver autenticado
  res.status(200).json({ message: "Acesso autorizado" });
});

// Outra rota protegida que requer autenticação e verificação de usuário
router.get("/profile", requireAuth, checkUser, (req, res) => {
  // Esta rota só será acessível se o usuário estiver autenticado e ainda existir no banco de dados
  res.status(200).json({ user: res.locals.user });
});
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
// No arquivo authRoutes.js ou onde você define suas rotas no backend

router.get("/logout", (req, res) => {
  // Limpe quaisquer informações de autenticação no servidor, como sessão ou token JWT
  // Por exemplo:
  // req.session.destroy(); // Se você estiver usando sessões
  // Ou limpe o token JWT no cliente
  res.clearCookie("jwt"); // Se você estiver usando cookies para armazenar o token JWT
  res.status(200).json({ message: "Logout bem-sucedido" });
});

module.exports = router;
