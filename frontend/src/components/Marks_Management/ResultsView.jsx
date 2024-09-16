import { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import jsPDF from 'jspdf';  // Import jsPDF for PDF generation
import 'jspdf-autotable';   // AutoTable plugin for table generation in PDF
import './ResultsView.css';

const ResultsView = ({ semesterId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [semesterName, setSemesterName] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/students/semester/${semesterId}`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchSemester = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/semesters/${semesterId}`);
        const data = await response.json();
        setSemesterName(`${data.order} ${data.department}`);
      } catch (error) {
        console.error('Error fetching semester details:', error);
      }
    };

    fetchStudents();
    fetchSemester();
  }, [semesterId]);

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
  
    try {
      const response = await fetch(`http://localhost:3000/api/scores/student/${student._id}?semester=${semesterId}`);
      const data = await response.json();
      console.log(data);
  
      if (data.error) {
        console.error(data.error);
        setResults([]);
      } else {
        // Flatten the scores array if it's nested
        const flattenedScores = data.map(item => item.scores).flat();
        setResults(flattenedScores);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    }
  };

  const calculatePercentage = (totalScore) => {
    const maxScore = 100;
    return isNaN(totalScore) ? 'N/A' : ((totalScore / maxScore) * 100).toFixed(2);
  };

  const calculateFinalPercentage = () => {
    if (results.length === 0) return '0.00';
    const totalSum = results.reduce((sum, score) => sum + (isNaN(score.totalScore) ? 0 : score.totalScore), 0);
    return ((totalSum / (results.length * 100)) * 100).toFixed(2);
  };

  const renderPassFailStatus = () => {
    const finalPercentage = parseFloat(calculateFinalPercentage());
    return finalPercentage >= 35 ? 'Pass' : 'Fail';
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title and student details
    doc.text(`Results for ${selectedStudent.firstName}`, 10, 10);
    doc.text(`Semester: ${semesterName}`, 10, 20);
    doc.text(`Student ID: ${selectedStudent.studentId}`, 10, 30);
    doc.text(`Final Percentage: ${calculateFinalPercentage()}%`, 10, 40);
    doc.text(`Status: ${renderPassFailStatus()}`, 10, 50);

    // Add results table
    const tableColumnHeaders = ["Subject", "Subject Code", "CA Score", "Exam Score", "Total Score", "Percentage"];
    const tableRows = results.map(score => [
      score.subject.name,
      score.subject.subjectCode,
      score.caScore ?? 'N/A',
      score.examScore ?? 'N/A',
      score.totalScore ?? 'N/A',
      calculatePercentage(score.totalScore)
    ]);

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 60,  // Start the table below the details
    });

    // Add final percentage and pass/fail status at the bottom
    doc.text(`Final Percentage: ${calculateFinalPercentage()}%`, 10, doc.autoTable.previous.finalY + 20);
    doc.text(`Status: ${renderPassFailStatus()}`, 10, doc.autoTable.previous.finalY + 30);

    // Save the PDF
    doc.save(`${selectedStudent.firstName}_Results.pdf`);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Subject',
        accessor: 'subject.name',
      },
      {
        Header: 'Subject Code',
        accessor: 'subject.subjectCode',
      },
      {
        Header: 'CA Score',
        accessor: 'caScore',
        Cell: ({ cell: { value } }) => (isNaN(value) ? 'N/A' : value),
      },
      {
        Header: 'Exam Score',
        accessor: 'examScore',
        Cell: ({ cell: { value } }) => (isNaN(value) ? 'N/A' : value),
      },
      {
        Header: 'Total Score',
        accessor: 'totalScore',
        Cell: ({ cell: { value } }) => (isNaN(value) ? 'N/A' : value),
      },
      {
        Header: 'Percentage',
        Cell: ({ row }) => (
          <span>{calculatePercentage(row.original.totalScore)}%</span>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => results, [results]);

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div>
      <h2>Results View</h2>

      {selectedStudent && (
        <div className="student-details">
          <p><strong>Student Name:</strong> {selectedStudent.firstName}</p>
          <p><strong>Semester:</strong> {selectedStudent.semester  +' ' +selectedStudent.department}</p>
          <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
        </div>
      )}

      {students.length > 0 && (
        <div>
          <h3>Select a student:</h3>
          <ul>
            {students.map((student) => (
              <li key={student._id}>
                <button onClick={() => handleStudentSelect(student)}>
                  {student.firstName + ' ' + student.lastName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 ? (
        <div>
          <table {...getTableProps()} className="results-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                <td colSpan={5} style={{ textAlign: 'right' }}>
                  <strong>Final Percentage:</strong>
                </td>
                <td>{calculateFinalPercentage()}%</td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: 'right' }}>
                  <strong>Status:</strong>
                </td>
                <td>{renderPassFailStatus()}</td>
              </tr>
            </tbody>
          </table>

          {/* Button to download the PDF */}
          <button onClick={downloadPDF} className="download-btn">Download PDF</button>
        </div>
      ) : (
        selectedStudent && <p>No results found for this student.</p>
      )}
    </div>
  );
};

export default ResultsView;
