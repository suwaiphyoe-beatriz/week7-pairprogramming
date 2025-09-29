const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); 
const api = supertest(app);
const Job = require("../models/jobModel");
const User = require("../models/userModel");

const jobs = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    description: "Work with React and modern frontend technologies.",
    company: {
      name: "TechCorp",
      contactEmail: "hr@techcorp.com",
      contactPhone: "123-456-7890",
    },
  },
  {
    title: "Backend Developer",
    type: "Part-time",
    description: "Develop APIs and manage databases with Node.js.",
    company: {
      name: "CodeFactory",
      contactEmail: "jobs@codefactory.com",
      contactPhone: "987-654-3210",
    },
  },
];

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "Jane Doe",
    email: "jane@example.com",
    password: "StrongPass123!",
    phone_number: "1234567890",
    gender: "Female",
    date_of_birth: "1995-05-05",
    membership_status: "Inactive",
  });
  token = result.body.token;
});

describe("Given there are initially some jobs saved", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Promise.all([
      api.post("/api/jobs").set("Authorization", "bearer " + token).send(jobs[0]),
      api.post("/api/jobs").set("Authorization", "bearer " + token).send(jobs[1]),
    ]);
  });

  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    await api
      .get("/api/jobs")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  
  it("should create one job when POST /api/jobs is called", async () => {
    const newJob = {
      title: "Full Stack Developer",
      type: "Contract",
      description: "Build and maintain full stack web applications.",
      company: {
        name: "InnovateX",
        contactEmail: "careers@innovatex.com",
        contactPhone: "555-555-5555",
      },
    };
    await api
      .post("/api/jobs")
      .set("Authorization", "bearer " + token)
      .send(newJob)
      .expect(201);
  });

  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get("/api/jobs/" + job._id)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one job by ID when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated job description.",
      type: "Remote",
    };
    const response = await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", "bearer " + token)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.description).toBe(updatedJob.description);
    expect(updatedJobCheck.type).toBe(updatedJob.type);
  });

  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .delete("/api/jobs/" + job._id)
      .set("Authorization", "bearer " + token)
      .expect(204);
    const jobCheck = await Job.findById(job._id);
    expect(jobCheck).toBeNull();
  });
});

afterAll(() => {
  mongoose.connection.close();
});