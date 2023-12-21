import React, { useEffect, useState } from "react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/getSchools?page=${currentPage}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setSchools(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (!schools.length)
    return <div className="text-center py-4">No schools found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Schools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school, index) => (
          <div
            key={index}
            className="max-w-sm rounded overflow-hidden shadow-lg"
          >
            <img
              className="w-full"
              src={`/schoolImages/${school.image}`}
              alt={school.name}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{school.name}</div>
              <p className="text-gray-700 text-base">
                {school.address}, {school.city}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-4 py-2 rounded ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
