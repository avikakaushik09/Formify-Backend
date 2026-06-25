"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [user, setUser] = useState(null);
  const [totalResponses, setTotalResponses] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchForms(token);
  }, []);

  const fetchForms = async (token) => {
    try {
      const res = await axios.get(
        "https://formify-backend-zkl2.onrender.com/api/forms/my-forms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForms(res.data);

      let total = 0;

      for (const form of res.data) {
        try {
          const responseRes = await axios.get(
            `https://formify-backend-zkl2.onrender.com/api/responses/${form._id}`
          );

          total += responseRes.data.length;
        } catch (err) {
          console.log(err);
        }
      }

      setTotalResponses(total);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const copyLink = (id) => {
    navigator.clipboard.writeText(
      `http://localhost:3000/forms/${id}`
    );

    alert("Form Link Copied!");
  };

  return (
    <div className="min-h-screen bg-[#f8f6ff] flex">

      {/* Sidebar */}

      <div className="w-64 bg-white shadow-lg p-6 hidden md:block">

        <h1 className="text-3xl font-bold text-violet-600 mb-10">
          Formify
        </h1>

        <div className="space-y-4">

          <div className="bg-violet-100 text-violet-700 p-3 rounded-xl font-medium">
            📊 Dashboard
          </div>

          <div className="text-gray-600 p-3 rounded-xl hover:bg-gray-100 cursor-pointer">
            📝 Forms
          </div>

          <div className="text-gray-600 p-3 rounded-xl hover:bg-gray-100 cursor-pointer">
            📈 Analytics
          </div>

          <div className="text-gray-600 p-3 rounded-xl hover:bg-gray-100 cursor-pointer">
            ⚙ Settings
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-500 text-white py-3 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}

      <div className="flex-1 p-8">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome Back, {user?.name || "User"} 👋
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your forms and responses
            </p>
          </div>

          <button
            onClick={() => router.push("/builder")}
            className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            + Create Form
          </button>
        </div>

        {/* Stats Cards */}

        <div className="grid md:grid-cols-4 gap-5 mb-10">

          <div className="bg-white p-6 rounded-3xl shadow-md">
            <p className="text-gray-500">Total Forms</p>
            <h2 className="text-4xl font-bold text-violet-600 mt-2">
              {forms.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md">
            <p className="text-gray-500">Published Forms</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {forms.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md">
            <p className="text-gray-500">Responses</p>
            <h2 className="text-4xl font-bold text-pink-600 mt-2">
              {totalResponses}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md">
            <p className="text-gray-500">Engagement</p>
            <h2 className="text-4xl font-bold text-orange-500 mt-2">
              100%
            </h2>
          </div>

        </div>

        {/* Forms Section */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Forms */}

          <div className="lg:col-span-2">

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              My Forms
            </h2>

            {forms.map((form) => (
              <div
                key={form._id}
                className="bg-white p-6 rounded-3xl shadow-md mb-5"
              >
                <h3 className="text-2xl font-bold text-violet-700">
                  {form.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {form.description}
                </p>

                <p className="text-sm text-gray-400 mt-3">
                  Fields: {form.fields?.length}
                </p>

                <div className="flex gap-3 mt-5 flex-wrap">

                  <button
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/forms/${form._id}`,
                        "_blank"
                      )
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                  >
                    View Form
                  </button>

                  <button
                    onClick={() => copyLink(form._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl"
                  >
                    Copy Link
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/responses/${form._id}`)
                    }
                    className="bg-violet-600 text-white px-4 py-2 rounded-xl"
                  >
                    View Responses
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}

          <div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Activity Feed
            </h2>

            <div className="bg-white rounded-3xl shadow-md p-6">

              <div className="border-b py-3">
                🟢 Form Created Successfully
              </div>

              <div className="border-b py-3">
                🟣 Response Received
              </div>

              <div className="border-b py-3">
                🔵 Public Form Shared
              </div>

              <div className="py-3">
                ⚡ Dashboard Active
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}