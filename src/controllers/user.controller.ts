import { user } from "../services";
import { Request, Response, NextFunction } from "express";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserOK:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           description: Operation OK
 *       example:
 *         ok: true
 *     UsersSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User id
 *         name:
 *           type: string
 *           description: User Name
 *         email:
 *           type: string
 *           description: User email
 *         type:
 *           type: string
 *           description: User type ( MANAGER, TECH )
 *         active:
 *           type: integer
 *           description: User active(1 - true, 0 - false)
 *         created_at:
 *           type: timestamp
 *           description: User Created At
 *       example: 
 *         id: 1,
 *         name: Manager Base,
 *         email: manager@mail.com,
 *         type: MANAGER,
 *         active: 1
 *         created_at: 2023-05-19T23:00:00.000Z
 *     UsersSchemaSend:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - password_confirmation
 *         - type
 *         - created_at
 *       properties:
 *         name:
 *           type: string
 *           description: User Name
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User pass
 *         password_confirmation:
 *           type: string
 *           description: User pass confirm
 *         type:
 *           type: string
 *           description: User type ( MANAGER, TECH )
 *         created_at:
 *           type: timestamp
 *           description: User Created At
 *       example: 
 *         name: Manager Base2,
 *         email: manager2@mail.com,
 *         password: m123,
 *         password_confirmation: m123,
 *         type: MANAGER,
 *         active: 1
 *         created_at: 2023-05-19T23:00:00.000Z
 *          
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - BearerAuth: []
 * tags:
 *   name: Users
 *   description: Users controllers
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User informations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsersSchema'
 *       401:
 *         description: Unauthorized
 *
 */
export const all = async (req: Request, res: Response, next: NextFunction) => {
  var data = await user.all();
  var status = data.ok ? 200 : 400;
  res.status(status).send(data.data);
};


/**
 * @swagger
* tags:
*   name: Users
*   description: Users controllers
* /users/{id}:
*   get:
*     summary: Get user by id
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: integer
*     responses:
*       200:
*         description: User informations.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UsersSchema'
*       401:
*         description: Unauthorized
*
*/
export const show = async (req: Request, res: Response, next: NextFunction) => {
  var data = await user.show({ id: req.params.id });
  var status = data.ok ? 200 : 400;
  res.status(status).send(data.data);
};



/**
 * @swagger
* tags:
*   name: Users
*   description: Users controllers
* /users:
*   post:
*     summary: Insert new User
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UsersSchemaSend'
*     responses:
*       200:
*         description: Operation status
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UserOK'
*       401:
*         description: Unauthorized
*
*/
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var data = await user.store(req.body);
  var status = data.ok ? 200 : 400;
  res.status(status).send(data);
};

/**
 * @swagger
* tags:
*   name: Users
*   description: Users controllers
* /users/{id}:
*   put:
*     summary: Update user by id
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UsersSchemaSend'
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: integer
*     responses:
*       200:
*         description: Operation status
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UserOK'
*       401:
*         description: Unauthorized
*
*/
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var data = await user.update(parseInt(req.params.id), req.body);
  var status = data.ok ? 200 : 400;
  res.status(status).send(data);
};

/**
 * @swagger
* tags:
*   name: Users
*   description: Users controllers
* /users/{id}:
*   delete:
*     summary: Delete user by id
*     tags: [Users]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: integer
*     responses:
*       201:
*         description: status ok.
*       401:
*         description: Unauthorized
*
*/
export const drop = async (req: Request, res: Response, next: NextFunction) => {
  var data = await user.drop(parseInt(req.params.id));
  var status = data.ok ? 201 : 400;
  res.status(status).send();
};
