const router = require("express").Router();
const Result = require("../models/Result");

const gradeOf = (p) =>
  p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : p >= 40 ? "D" : "F";

// CREATE: enter marks, calculate and save
router.post("/", async (req, res) => {
  try {
    const { studentName, rollNo, subjects } = req.body;
    if (!studentName || !Array.isArray(subjects) || !subjects.length)
      return res.status(400).json({ error: "Name and at least one subject required" });

    for (const s of subjects)
      if (s.marks < 0 || s.marks > s.outOf)
        return res.status(400).json({ error: `Invalid marks for ${s.name}` });

    const total = subjects.reduce((a, s) => a + s.marks, 0);
    const maxTotal = subjects.reduce((a, s) => a + s.outOf, 0);
    const percentage = +((total / maxTotal) * 100).toFixed(2);
    const status = subjects.every((s) => s.marks / s.outOf >= 0.4) ? "PASS" : "FAIL";

    const result = await Result.create({
      studentName, rollNo, subjects, total, maxTotal,
      percentage, grade: gradeOf(percentage), status,
    });
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ: all results
router.get("/", async (req, res) => {
  res.json(await Result.find().sort({ createdAt: -1 }));
});

// READ: one result
router.get("/:id", async (req, res) => {
  const r = await Result.findById(req.params.id);
  r ? res.json(r) : res.status(404).json({ error: "Not found" });
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Result.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;