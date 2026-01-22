import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CourseCard({ course }: { course: any }) {
  return (
    <div className="w-48 bg-white rounded shadow hover:shadow-md cursor-pointer">
      <div className="relative w-full h-28">
        <Image
          src="/img_javascript_480.jpg" // tu peux changer par une image dynamique
          alt={course.title}
          fill
          className="object-cover rounded-t"
        />
      </div>

      <div className="p-3">
        <p className="font-medium text-sm">{course.title}</p>
      </div>
    </div>
  );
}
