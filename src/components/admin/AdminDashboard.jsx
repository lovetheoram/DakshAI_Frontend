import ConceptGenerator from "./ConceptGenerator";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* SECTION 1 */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">
          Concept Meta & Question Generation
        </h2>

        <ConceptGenerator />
      </div>

      {/* Future admin sections go here */}
      {/*
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">
          User Management
        </h2>
        <UserManagement />
      </div>
      */}

    </div>
  );
}