import axios from "axios";
import { useAuth } from "../utils/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotif } from "./NotificationContext"

export default function Prediction() {
  const { showNotif } = useNotif();

  const goto = useNavigate();
  const user = useAuth();
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [predictionData, setPredictionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const [showPredictionPopup, setShowPredictionPopup] = useState(false);
  const [promoName, setPromoName] = useState("");
  const [promoDiscount, setPromoDiscount] = useState("");
  const [promoDiscountBSU, setPromoDiscountBSU] = useState("");
  const [expiredDate, setExpiredDate] = useState("");

  const limit = 10;

  useEffect(() => {

    if (user) {

      setAvatarSrc(
        user.avatar || "https://via.placeholder.com/100"
      );

      fetchPredictionData(page);

    }

  }, [user, page]);

  const fetchPredictionData = async (currentPage = 1) => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found!");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/prediction/prediction-data?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.status === "success") {

        setPredictionData(data.data || []);

        setPage(data.page || 1);

        setTotalPages(data.totalPages || 1);

        setTotalData(data.totalData || 0);

      } else {

        setPredictionData([]);

      }

    } catch (error) {

      console.error(
        "Error fetching prediction data:",
        error
      );

      setPredictionData([]);

    } finally {

      setLoading(false);

    }
  };

  const handleNOsave = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/prediction/no-save`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }

      );
      setShowPredictionPopup(false)
      showNotif("success", response.data.message);
      fetchPredictionData(page)
      setTotalData(0)
    } catch (err) {
      console.log(err)
    }
  }

  const handleYESsave = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/prediction/yes-save`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }

      );
      setShowPredictionPopup(false)
      showNotif("success", response.data.message);
      fetchPredictionData(page)
      setTotalData(0)
    } catch (err) {
      console.log(err)
    }
  }

  const handleNewPrediction = async () => {

    try {

      alert("New prediction created!");

      setShowPredictionPopup(false);

      goto("/validation");

    } catch (err) {

      console.log(err);

    }

  };

  if (!user) {

    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <div className="flex items-center gap-4">

            <img
              src={avatarSrc}
              alt="profile"
              className="w-20 h-20 rounded-full border"
              onError={() => {
                setAvatarSrc(
                  "https://via.placeholder.com/100"
                );
              }}
            />

            <div>

              <h1 className="text-3xl font-bold">
                Prediction Dashboard
              </h1>

              <p className="text-gray-600 mt-1">
                Welcome back, {user.name}
              </p>

              <p className="text-gray-500 text-sm">
                {user.email}
              </p>

            </div>

          </div>

        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-xl shadow-md p-6">

          {/* TOP INFO */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">

            <div>

              <h2 className="text-2xl font-bold">
                Prediction Table
              </h2>

              <p className="text-gray-500 mt-1">
                Total Data: {totalData}
              </p>

            </div>

            {
              predictionData.length > 0 && (
                <div className="flex gap-3">

                  <button
                    onClick={() => setShowBulkPopup(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold transition"
                  >
                    Bulk Send Email
                  </button>

                  <button
                    onClick={() => setShowPredictionPopup(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition"
                  >
                    buat prediksi baru
                  </button>

                </div>
              )
            }

          </div>

          {/* LOADING */}
          {
            loading ? (

              <div className="text-center py-10 text-lg">
                Loading data...
              </div>

            ) : predictionData.length === 0 ? (

              <div className="flex flex-col justify-center items-center py-20">

                <h2 className="text-3xl font-bold text-gray-700 mb-3">
                  No Prediction Data
                </h2>

                <p className="text-gray-500 mb-8 text-center max-w-md">
                  You don't have any prediction data yet.
                  Start by validating your dataset and generating a new prediction.
                </p>

                <button
                  onClick={() => goto("/validation")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
                >
                  Go To Validation
                </button>

              </div>

            ) : (

              <>
                {/* PAGE INFO */}
                <div className="flex justify-end mb-4">

                  <div className="text-sm text-gray-500">

                    Page {page} of {totalPages}

                  </div>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full border border-gray-300">

                    <thead className="bg-gray-100">

                      <tr>

                        <th className="p-3 border">
                          Detail ID
                        </th>

                        <th className="p-3 border">
                          Prediction ID
                        </th>

                        <th className="p-3 border">
                          Customer ID
                        </th>

                        <th className="p-3 border">
                          Account Age
                        </th>

                        <th className="p-3 border">
                          Monthly Charges
                        </th>

                        <th className="p-3 border">
                          Total Charges
                        </th>

                        <th className="p-3 border">
                          Score
                        </th>

                        <th className="p-3 border">
                          Risk
                        </th>

                        <th className="p-3 border">
                          Prediction
                        </th>

                        <th className="p-3 border">
                          Segment
                        </th>

                        <th className="p-3 border">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {
                        predictionData.map((item, index) => (

                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition"
                          >

                            <td className="p-3 border">
                              {item.detail_id}
                            </td>

                            <td className="p-3 border">
                              {item.prediction_id}
                            </td>

                            <td className="p-3 border">
                              {item.CustomerID}
                            </td>

                            <td className="p-3 border">
                              {item.AccountAge}
                            </td>

                            <td className="p-3 border">
                              ${item.MonthlyCharges}
                            </td>

                            <td className="p-3 border">
                              ${item.TotalCharges}
                            </td>

                            <td className="p-3 border font-semibold">
                              {item.Score}
                            </td>

                            <td className="p-3 border">

                              <span
                                className={`
                                  px-3 py-1 rounded-full text-white text-sm
                                  ${item.Risk === "High"
                                    ? "bg-red-500"
                                    : item.Risk === "Medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }
                                `}
                              >
                                {item.Risk}
                              </span>

                            </td>

                            <td className="p-3 border">

                              {
                                item.Prediction === 1
                                  ? (
                                    <span className="text-red-500 font-bold">
                                      Churn
                                    </span>
                                  )
                                  : (
                                    <span className="text-green-500 font-bold">
                                      Non-Churn
                                    </span>
                                  )
                              }

                            </td>

                            <td className="p-3 border">
                              {item.Segment}
                            </td>

                            <td className="p-3 border">

                              <button
                                onClick={() =>
                                  goto(
                                    `/costumerDetail?prediction_id=${item.prediction_id}&CustomerID=${item.CustomerID}`
                                  )
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                              >
                                Detail
                              </button>

                            </td>

                          </tr>

                        ))
                      }

                    </tbody>

                  </table>

                </div>

                {/* PAGINATION */}
                <div className="flex justify-center items-center gap-4 mt-6">

                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`
                      px-5 py-2 rounded-lg text-white font-semibold
                      ${page === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-500 hover:bg-gray-600"
                      }
                    `}
                  >
                    Previous
                  </button>

                  <span className="font-semibold">
                    {page} / {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`
                      px-5 py-2 rounded-lg text-white font-semibold
                      ${page === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                      }
                    `}
                  >
                    Next
                  </button>

                </div>
              </>
            )
          }

        </div>

      </div>

      {
        showBulkPopup && (

          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl p-8 w-[1000px] shadow-2xl">



              <div className="mb-8">

                <h3 className="text-xl font-bold mb-4">
                  Retention Strategy
                </h3>

                <div className="overflow-x-auto">

                  <table className="w-full border border-gray-300">

                    <thead className="bg-gray-100">

                      <tr>

                        <th className="p-3 border">
                          Risk
                        </th>

                        <th className="p-3 border">
                          Segment
                        </th>

                        <th className="p-3 border">
                          Promo Strategy
                        </th>

                        <th className="p-3 border">
                          Movie Recommendation
                        </th>

                        <th className="p-3 border">
                          Promo Name
                        </th>

                        <th className="p-3 border">
                          Discount %
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      <tr className="hover:bg-gray-50">

                        <td className="p-3 border font-semibold text-red-500">
                          High, Medium
                        </td>

                        <td className="p-3 border">
                          Basic Frustrated User
                        </td>

                        <td className="p-3 border">
                          30–40% comeback promo
                        </td>

                        <td className="p-3 border">
                          Favorite genre + trending movies
                        </td>

                        <td className="p-3 border">

                          <input
                            type="text"
                            placeholder="Ex: Comeback Premium"
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                        <td className="p-3 border">

                          <input
                            type="number"
                            placeholder="40"
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                      </tr>

                      <tr className="hover:bg-gray-50">

                        <td className="p-3 border font-semibold text-orange-500">
                          High, Medium
                        </td>

                        <td className="p-3 border">
                          Experienced User
                        </td>

                        <td className="p-3 border">
                          Medium promo
                        </td>

                        <td className="p-3 border">
                          Popular movie recommendations
                        </td>

                        <td className="p-3 border">

                          <input
                            type="text"
                            placeholder="Ex: Loyalty Reward"
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                        <td className="p-3 border">

                          <input
                            type="number"
                            placeholder="20"
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                      </tr>

                      <tr className="hover:bg-gray-50">

                        <td className="p-3 border font-semibold text-yellow-500">
                          Medium, High
                        </td>

                        <td className="p-3 border">
                          Basic User
                        </td>

                        <td className="p-3 border">
                          Limited promo
                        </td>

                        <td className="p-3 border">
                          Trending genre movies
                        </td>

                        <td className="p-3 border">

                          <input
                            type="text"
                            placeholder="Ex: Weekend Promo"
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                        <td className="p-3 border">

                          <input
                            type="number"
                            placeholder="15"
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                      </tr>

                      <tr className="hover:bg-gray-50">

                        <td className="p-3 border font-semibold text-green-500">
                          Low
                        </td>

                        <td className="p-3 border">
                          Basic User, Experienced User
                        </td>

                        <td className="p-3 border">
                          Low promo
                        </td>

                        <td className="p-3 border">
                          Popular movie recommendations
                        </td>

                        <td className="p-3 border">

                          <input
                            type="text"
                            placeholder="Ex: Member Special"
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                        <td className="p-3 border">

                          <input
                            type="number"
                            placeholder="10"
                            className="w-full border rounded-lg p-2"
                          />

                        </td>

                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>

              {/* ACTION BUTTON */}
              <div className="flex justify-end gap-4">

                <button
                  onClick={() => setShowBulkPopup(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>

                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Send Bulk Email
                </button>

              </div>

            </div>

          </div>

        )
      }

      {/* NEW PREDICTION POPUP */}
      {
        showPredictionPopup && (

          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl p-6 w-[450px] shadow-2xl">

              <h2 className="text-2xl font-bold mb-4">
                buat prediksi baru
              </h2>

              <p className="text-gray-700 mb-6">
                kamu akan membuat prediksi baru, apakah kamu mau save prediksi sekarang?
              </p>

              <div className="flex gap-3">

                <button
                  onClick={handleNOsave}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold"
                >
                  No
                </button>

                <button
                  onClick={handleYESsave}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
                >
                  Yes
                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>
  );
}