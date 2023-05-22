import request from "supertest";

import app from "../src/app";

describe("Test app.ts", () => {
  var tokenManager: string = "";
  var tokenTech: string = "";
  const objToSendLoginManager = {
    email: "manager@mail.com",
    password: "manager123",
  };
  const objToSendLoginTech = {
    email: "techbase@mail.com",
    password: "tech123",
  };
  var userId:number;

  test("Catch-all route", async () => {
    const res = await request(app).get("/");
    expect(res.body).toEqual({ message: "Allo! Catch-all route." });
  });

  test("Auth Test Manager", async () => {
    var res = await request(app).post("/auth").send(objToSendLoginManager);
    expect(res.body.email).toEqual(objToSendLoginManager.email);
    tokenManager = res.body.token;
  });

  test("Auth Test Tech", async () => {
    var res = await request(app).post("/auth").send(objToSendLoginTech);
    expect(res.body.email).toEqual(objToSendLoginTech.email);
    tokenTech = res.body.token;
  });
  
  test("Me Manager", async () => {
    var dataReq = request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${tokenManager}`);
    const res = await dataReq;
    expect(res.body.email).toEqual(objToSendLoginManager.email);
  });
  
  test("Me Tech", async () => {
    var dataReq = request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${tokenTech}`);
    const res = await dataReq;
    expect(res.body.email).toEqual(objToSendLoginTech.email);
  });

  /*Users - Only Manager can do it*/
  test("Store user", async () => {
    var dataReq = request(app)
      .post("/users")
      .send({
        name: "test",
        email: "tech@mail.com",
        password: "test",
        password_confirmation: "test",
        type: "TECH",
        active: 1,
        created_at: "2023-05-21",
      })
      .set("Authorization", `Bearer ${tokenManager}`);
    const res = await dataReq;
    expect(res.body.ok).toEqual(true);
    userId = res.body.data.id;
  });

  test("Get all users", async () => {
    var dataReq = request(app)
      .get("/users")
      .set("Authorization", `Bearer ${tokenManager}`);
    const res = await dataReq;
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: "tech@mail.com",
        }),
      ])
    );
  });
  test("Get single user", async () => {
    var dataReq = request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${tokenManager}`);
    const res = await dataReq;    
    expect(res.body.email).toEqual("tech@mail.com");
  });
  
  test("Update user", async () => {
    var dataReq = request(app)
      .put(`/users/${userId}`)
      .send({
        name: "test updated",
        email: "tech@mail.com",
        password: "test",
        password_confirmation: "test",
        type: "TECH",
        active: 1,
        created_at: "2023-05-21",
      })
      .set("Authorization", `Bearer ${tokenManager}`);
    const res = await dataReq;
    expect(res.body.ok).toEqual(true);
  });

  test("delete user", async () => {
    var dataReq = request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${tokenManager}`);
    const res = await dataReq;
    expect(res.status).toEqual(201);
  });
  
  /*Tasks - Create and Update - Onli
  test("Get all users", async () => {
    var dataReq = request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    const res = await dataReq;
    expect(res.body.ok).toEqual(true);
  });
  */
});
