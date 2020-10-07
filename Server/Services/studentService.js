const Student = require("../Models/Students");

let getStudents = async (skip, limit, search) => {
  let query = { isDelete: false };
  if (search && search !== "undefined" && search !== "null") {
    query["$or"] = [
      {
        firstName: new RegExp(search ? search : "", "i"),
      },
      {
        lastName: new RegExp(search ? search : "", "i"),
      },
      {
        class: new RegExp(search ? search : "", "i"),
      }
    ];
  }
  return await Student.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
};
let getStudentsCount = async () => {
  let query = { isDelete: false };
  return await Student.find(query).countDocuments().lean();
};
let addStudent = async (data) => {
  return await Student.create(data);
};
let editStudents = async (data) => {
  return await Student.findOneAndUpdate(
    { _id: data._id },
    { $set: data },
    { new: true }
  );
};
let deleteStudents = async (id) => {
  return await Student.findOneAndUpdate(
    { _id: id },
    { $set: { isDelete: true } }
  );
};
module.exports = {
  getStudents,
  getStudentsCount,
  addStudent,
  editStudents,
  deleteStudents,
};
