// print-templates/ResultPrint.tsx
import PrintContainer from "@/components/print/PrintContainer";

export default function ResultPrint({ student, results, session }) {
  return (
    <PrintContainer>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">SEMESTER RESULT</h2>
        <p>Adeyemi Federal University of Education, Ondo</p>
        <p><strong>Session:</strong> {session}</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Matric No:</strong> {student.matric_no}</p>
        <p><strong>Department:</strong> {student.department}</p>
        <p><strong>Level:</strong> {student.level}</p>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2">Course</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Grade</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td className="border p-2">{r.course_title}</td>
              <td className="border p-2">{r.course_code}</td>
              <td className="border p-2">{r.unit}</td>
              <td className="border p-2">{r.score}</td>
              <td className="border p-2">{r.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-10 flex justify-between">
        <div>
          _______________________  
          <p>Lecturer's Signature</p>
        </div>

        <div>
          _______________________  
          <p>HOD's Signature</p>
        </div>
      </div>
    </PrintContainer>
  );
}
