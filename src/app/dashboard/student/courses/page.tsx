"use client";

import { useEffect, useState } from "react";
import CourseCard from "../../../components/CourseCard";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []));
  }, []);

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-xl font-bold mb-6">Vue d’ensemble des cours</h1>

      {/* Filters row */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 border rounded">Tout</button>
        <input
          type="text"
          placeholder="Rechercher"
          className="px-4 py-2 border rounded"
        />
        <button className="px-4 py-2 border rounded">
          Trier par nom de cours ▾
        </button>
        <button className="px-4 py-2 border rounded">
          Carte ▾
        </button>
      </div>

      {/* Courses grid */}
      <div className="flex flex-wrap gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
