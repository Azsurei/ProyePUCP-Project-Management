const express = require("express");
const routerAutoEvaluacion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const autoEvaluacionController = require("../controllers/autoEvaluacion/autoEvaluacionController");



module.exports.routerAutoEvaluacion = routerAutoEvaluacion;