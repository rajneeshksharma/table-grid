const express = require("express");
const router = express.Router();
const studentService = require("../Services/studentService");
const { body, validationResult } = require("express-validator");
const studentValidation = [
  body("firstName")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("firstName is required."),
  body("lastName")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("lastName is required."),
  body("class")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("class is required."),
  body("subjects.*.name")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("subject name is required."),
  body("subjects.*.marks")
    .isNumeric()
    .withMessage("Subject marks are need to be number and required."),
];
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express API Endpoint" });
});
router.get("/students", async (req, res, next) => {
  try {
    let { page, perPage, search } = req.query ? req.query : {};
    if (!perPage) {
      perPage = parseInt(perPage) || 10;
    }
    page = parseInt(page) || 1;
    let totalStudents = await studentService.getStudentsCount();
    let getStudents = await studentService.getStudents(
      parseInt(perPage) * parseInt(page) - parseInt(perPage),
      parseInt(perPage),
      search
    );
    return res.status(200).json({
      status: true,
      message: "List of students.",
      data: {
        total: totalStudents,
        page: page,
        result: getStudents,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      status: false,
      message: "Internal server error, Please try again.",
      error: error,
    });
  }
});
router.post("/students", studentValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        message: "Validation errors",
        data: errors.array().map((x) => x.msg),
      });
    }
    let newStudent = await studentService.addStudent(req.body);
    return res.status(200).json({
      status: true,
      message: "New student added.",
      data: newStudent,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      status: false,
      message: "Internal server error, Please try again.",
      error: error,
    });
  }
});
router.put(
  "/students",
  [
    ...studentValidation,
    [
      body("_id")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("user id is required"),
    ],
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({
          status: false,
          message: "Validation errors",
          data: errors.array().map((x) => x.msg),
        });
      }
      let newStudent = await studentService.editStudents(req.body);
      return res.status(200).json({
        status: true,
        message: "Student updated.",
        data: newStudent,
      });
    } catch (error) {
      console.error(error);
      return res.status(200).json({
        status: false,
        message: "Internal server error, Please try again.",
        error: error,
      });
    }
  }
);
router.delete("/students", async (req, res, next) => {
  try {
    if (!req.query.id) {
      return res.status(200).json({
        status: false,
        message: "Validation errors",
        data: ["id required."],
      });
    }
    let newStudent = await studentService.deleteStudents(req.query.id);
    return res.status(200).json({
      status: true,
      message: "Student deleted.",
      data: newStudent,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      status: false,
      message: "Internal server error, Please try again.",
      error: error,
    });
  }
});
module.exports = router;
