import { auth } from "../services";
import { Request, Response, NextFunction } from "express";

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     AuthInterface:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's Email
 *         password:
 *           type: string
 *           description: User's password
 *       example:
 *         email: manager@mail.com
 *         password: manager123
 *     AuthSuccessReturn:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *             description: User name
 *           email:
 *             type: string
 *             description: User E-mail
 *           token:
 *             type: string
 *             description: Token to use in other endpoints
 *         example:
 *           name: Manager Base,
 *           email: manager@mail.com,
 *           token: "2b08e7d3eb96150ab79b29b059b23a6a.2b08e7d3eb96150ab79b29b059b23a6a"
 *     AuthErrorReturn:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           field_name:
 *             type: string
 *             description: Field where there is a problem
 *         example: [
 *           email: "Email required",
 *           password: "Password required",
 *           general: "Invalid user or password"
 *          ]
 * tags:
 *   name: Authentication
 *   description: Login and Me data informations
 * /auth:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthInterface'
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessReturn'
 *       400:
 *         description: invalid User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorReturn'
 *
 */

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var data = await auth.login({
    email: req.body.email,
    password: req.body.password,
  });
  var status = data.ok ? 200 : 400;
  res.status(status).send(data.data);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     MeInterface:
 *       type: object
 *       properties:
 *         id:
 *           type: int
 *           description: User's id
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's Email
 *         type:
 *           type: string
 *           description: User's type (MANAGER, TECH)
 *       example:
 *         id: id
 *         name: Manager Base
 *         email: manager@mail.com
 *         type: MANAGER
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - BearerAuth: []
 * tags:
 *   name: Authentication
 *   description: Login and Me data informations
 * /auth/me:
 *   get:
 *     summary: Me data informations
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User informations.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeInterface'
 *       401:
 *         description: Unauthorized
 *
 */
export const me = async (req: Request, res: Response, next: NextFunction) => {
  var data = await auth.me(req.headers.authorization || "");
  var status = data.ok ? 200 : 400;
  res.status(status).send(data.data);
};
