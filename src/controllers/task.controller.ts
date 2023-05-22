import { task, auth } from "../services";
import { Request, Response, NextFunction } from "express";
import {
  OtherFilters,
  FilterType,
  FilterCompare,
} from "../interfaces/filter.interface";

import { produce } from "../messages/producer";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskOK:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           description: Operation OK
 *       example:
 *         ok: true
 *     TaskSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Task id
 *         title:
 *           type: string
 *           description: Task Name
 *         summary:
 *           type: string
 *           description: Task email
 *         user_id:
 *           type: integer
 *           description: Task active(1 - true, 0 - false)
 *         created_at:
 *           type: string
 *           description: Task Created At
 *         updated_at:
 *           type: string
 *           description: Task Updated At
 *         finished_at:
 *           type: string
 *           description: Task Finished At
 *     TaskSchemaSend:
 *       type: object
 *       required:
 *         - title
 *         - summary
 *         - user_id
 *         - created_at
 *         - updated_at
 *       properties:
 *         title:
 *           type: string
 *           description: Task Name
 *         summary:
 *           type: string
 *           description: Task email
 *         user_id:
 *           type: integer
 *           description: Task active(1 - true, 0 - false)
 *         created_at:
 *           type: string
 *           description: Task Created At
 *         updated_at:
 *           type: string
 *           description: Task Updated At
 *         finished_at:
 *           type: string
 *           description: Task Finished At
 *       example: 
 *         title: Task 01,
 *         summary: Task 01 description,
 *         user_id: 2
 *         created_at: 2023-05-19T23:00:00.000Z
 *         updated_at: 2023-05-19T23:00:00.000Z *          
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - BearerAuth: []
 * tags:
 *   name: Tasks
 *   description: Tasks controllers
 * /tasks:
 *   get:
 *     summary: Get all Tasks. If the Auth User is MANAGER, you can see all tasks. If the Auth User is TECH, just can see self tasks
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         default: true
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task informations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaskSchema'
 *       401:
 *         description: Unauthorized
 *
 */
export const all = async (req: Request, res: Response, next: NextFunction) => {
  var filters: OtherFilters[] = [];
  req.query.active = req.query.active || "true";
  filters.push({
    name: "finished_at",
    value: "null",
    type: FilterType.WHERE,
    compare:
      req.query.active == "true" ? FilterCompare.IS : FilterCompare.ISNOT,
  });
  var dataAuth = await auth.me(req.headers.authorization || "");
  if (dataAuth.data.type == "TECH") {
    filters.push({
      name: "user_id",
      value: dataAuth.data.id as string,
      type: FilterType.WHERE,
      compare: FilterCompare.EQUAL,
    });
  } else if (req.query.user_id) {
    filters.push({
      name: "user_id",
      value: req.query.user_id as string,
      type: FilterType.WHERE,
      compare: FilterCompare.EQUAL,
    });
  }
  var data = await task.all({ other: filters });
  var status = data.ok ? 200 : 400;
  res.status(status).send(data.data);
};

/**
 * @swagger
* tags:
*   name: Tasks
*   description: Tasks controllers
* /tasks/{id}:
*   get:
*     summary: Get Task by id
*     tags: [Tasks]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: integer
*     responses:
*       200:
*         description: Task informations.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TaskSchema'
*       401:
*         description: Unauthorized
*
*/
export const show = async (req: Request, res: Response, next: NextFunction) => {
  var data = await task.show({ id: req.params.id });
  var status = data.ok ? 200 : 400;
  produce().catch((err) => {console.error('producer error: ' + err)});
  //produce('Hello KafkaJS user!' + Math.random().toString())
  res.status(status).send(data.data);
};



/**
 * @swagger
* tags:
*   name: Tasks
*   description: Tasks controllers
* /tasks:
*   post:
*     summary: Create Task by id
*     tags: [Tasks]
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/TaskSchemaSend'
*     responses:
*       200:
*         description: Operation status
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TaskOK'
*       401:
*         description: Unauthorized
*
*/
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var data = await task.store(req.body);
  var status = data.ok ? 200 : 400;
  //produce('Hello KafkaJS user!' + Math.random().toString())
  res.status(status).send(data);
};

/**
 * @swagger
* tags:
*   name: Tasks
*   description: Tasks controllers
* /tasks/{id}:
*   put:
*     summary: Update Task by id
*     tags: [Tasks]
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/TaskSchemaSend'
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
*               $ref: '#/components/schemas/TaskOK'
*       401:
*         description: Unauthorized
*
*/
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var data = await task.update(parseInt(req.params.id), req.body);
  var status = data.ok ? 200 : 400;
  res.status(status).send(data);
};

/**
 * @swagger
* tags:
*   name: Tasks
*   description: Tasks controllers
* /tasks/{id}:
*   delete:
*     summary: Delete task by id
*     tags: [Tasks]
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
    var data = await task.drop(parseInt(req.params.id));
    var status = data.ok ? 201 : 400;
    res.status(status).send();
  };