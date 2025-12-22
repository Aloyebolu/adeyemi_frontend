// print-templates/StudentListPrint.tsx
import PrintContainer from "@/components/print/PrintContainer";

export default function StudentListPrint({ title, students }) {
  return (
    <PrintContainer>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <p>Adeyemi Federal University of Education, Ondo</p>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Matric No</th>
            <th className="border p-2">Department</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr key={s._id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.matric_no}</td>
              <td className="border p-2">{s.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PrintContainer>
  );
}
