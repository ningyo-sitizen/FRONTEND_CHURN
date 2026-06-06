import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function CostumerDetail() {

  const [searchParams] = useSearchParams();

  const prediction_id = searchParams.get("prediction_id");
  const CustomerID = searchParams.get("CustomerID");

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chatMessage, setChatMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [promoName, setPromoName] = useState("");
  const [promoDiscount, setPromoDiscount] = useState("");
  const [expiredDate, setExpiredDate] = useState("");

  const getRetentionRecommendation = () => {

    if (detail.Risk === "High") {

      if (detail.Segment === "Basic Frustrated User") {
        return "Berikan diskon besar dan rekomendasi film favorit customer(sistem akan berikan) untuk mencegah churn.";
      }

      if (detail.Segment === "Basic User") {
        return "Berikan promo subscription dan rekomendasi content populer.(sistem akan berikan)";
      }

      return "Berikan loyalty offer dan rekomendasi exclusive content.(sistem akan berikan)";
    }

    if (detail.Risk === "Medium") {

      if (detail.Segment === "Basic Frustrated User") {
        return "Kirim rekomendasi film(sistem akan berikan) dan reminder untuk meningkatkan engagement.";
      }

      if (detail.Segment === "Basic User") {
        return "Rekomendasikan film trending berdasarkan genre favorit.(sistem akan berikan)";
      }

      return "Berikan reward kecil dan rekomendasi content premium.(sistem akan berikan)";
    }

    return "Tidak perlu diskon, cukup rekomendasikan film populer dan trending.(sistem akan berikan)";
  };

  const handleGenerateEmail = async () => {

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/email/generate`,
        {
          promo_name: promoName,
          promo_discount: promoDiscount,
          expired_date: expiredDate,
          risk: detail.Risk,
          segment: detail.Segment,
          genre: detail.GenrePreference,
          email: detail.email,
          nama_perusahaan: user?.nama_perusahaan,
          link_app: user?.link_app,
          nama_app: user?.nama_app
        }
      );

      setEmailMessage(response.data.html);
      setChatMessage(response.data.html)

      setShowPopup(false);

    } catch (err) {

      console.log(err);

    }
  };


  useEffect(() => {

    const fetchDataUserDetail = async () => {

      const token = localStorage.getItem("token");

      try {

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/prediction/costumer-detail?customerid=${CustomerID}&predictionid=${prediction_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDetail(response.data.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    fetchDataUserDetail();

  }, []);

  const handleSendChat = async () => {
    const token = localStorage.getItem("token");

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/email/send`,
        {
          html: chatMessage,
          email: detail.email
        }
      );
      setChatMessage("")
      setEmailMessage("")


    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Data tidak ditemukan
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">

          <h1 className="text-3xl font-bold mb-6">
            Customer Detail
          </h1>

          <div className="overflow-x-auto">

            <table className="w-full border border-gray-300">

              <tbody>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50 w-1/3">
                    Customer ID
                  </td>
                  <td className="p-3">
                    {detail.CustomerID}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Email
                  </td>
                  <td className="p-3">
                    {detail.email}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Account Age
                  </td>
                  <td className="p-3">
                    {detail.AccountAge} months
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Monthly Charges
                  </td>
                  <td className="p-3">
                    ${detail.MonthlyCharges}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Total Charges
                  </td>
                  <td className="p-3">
                    ${detail.TotalCharges}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Viewing Hours / Week
                  </td>
                  <td className="p-3">
                    {detail.ViewingHoursPerWeek}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Average Viewing Duration
                  </td>
                  <td className="p-3">
                    {detail.AverageViewingDuration}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Content Downloads / Month
                  </td>
                  <td className="p-3">
                    {detail.ContentDownloadsPerMonth}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    User Rating
                  </td>
                  <td className="p-3">
                    {detail.UserRating}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Support Tickets / Month
                  </td>
                  <td className="p-3">
                    {detail.SupportTicketsPerMonth}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Watchlist Size
                  </td>
                  <td className="p-3">
                    {detail.WatchlistSize}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Subscription Type
                  </td>
                  <td className="p-3">
                    {detail.SubscriptionType}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Content Type
                  </td>
                  <td className="p-3">
                    {detail.ContentType}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Genre Preference
                  </td>
                  <td className="p-3">
                    {detail.GenrePreference}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-semibold bg-gray-50">
                    Gender
                  </td>
                  <td className="p-3">
                    {detail.Gender}
                  </td>
                </tr>

                <tr className="border-b bg-yellow-50">
                  <td className="p-3 font-semibold">
                    Churn Probability
                  </td>
                  <td className="p-3 font-bold text-red-500">
                    {detail.Probability}
                  </td>
                </tr>

                <tr className="border-b bg-yellow-50">
                  <td className="p-3 font-semibold">
                    Churn Score
                  </td>
                  <td className="p-3 font-bold">
                    {detail.Score}
                  </td>
                </tr>

                <tr className="border-b bg-yellow-50">
                  <td className="p-3 font-semibold">
                    Risk Level
                  </td>
                  <td className="p-3 font-bold text-orange-500">
                    {detail.Risk}
                  </td>
                </tr>

                <tr className="border-b bg-yellow-50">
                  <td className="p-3 font-semibold">
                    Prediction
                  </td>
                  <td className="p-3 font-bold">
                    {detail.Prediction === 1 ? "Churn" : "Non-Churn"}
                  </td>
                </tr>

                <tr className="border-b bg-blue-50">
                  <td className="p-3 font-semibold">
                    Cluster
                  </td>
                  <td className="p-3">
                    {detail.Cluster}
                  </td>
                </tr>

                <tr className="bg-blue-50">
                  <td className="p-3 font-semibold">
                    Segment
                  </td>
                  <td className="p-3 font-bold">
                    {detail.Segment}
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">

          <h2 className="text-2xl font-bold mb-4">
            Customer Communication
          </h2>

          {/* CHAT SECTION */}
          <div className="mb-6">

            <label className="block mb-2 font-semibold">
              Send Chat
            </label>

            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              rows={5}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type chat message..."
            />

            <button
              onClick={handleSendChat}
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Send Chat
            </button>

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Generated Email
            </label>

            <div className="border rounded-lg p-3 bg-gray-50 max-h-[300px] overflow-auto">

              {
                emailMessage ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: emailMessage
                    }}
                  />
                ) : (
                  <p className="text-gray-400">
                    Generated email preview will appear here...
                  </p>
                )
              }

            </div>

            <div className="flex gap-3 mt-3">

              <button
                onClick={() => setShowPopup(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Generate Email
              </button>

              <button
                onClick={() => {
                  const previewWindow = window.open("", "_blank");

                  previewWindow.document.write(emailMessage);

                  previewWindow.document.close();
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Preview
              </button>

            </div>

          </div>

        </div>

      </div>
      {
        showPopup && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">

              <h2 className="text-2xl font-bold mb-4">
                Retention Campaign Generator
              </h2>

              <div className="mb-4">

                <label className="font-semibold block mb-2">
                  Risk Level
                </label>

                <input
                  type="text"
                  value={detail.Risk}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />

              </div>

              <div className="mb-4">

                <label className="font-semibold block mb-2">
                  Segment
                </label>

                <input
                  type="text"
                  value={detail.Segment}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />

              </div>

              <div className="mb-4">

                <label className="font-semibold block mb-2">
                  Retention Recommendation
                </label>

                <textarea
                  value={getRetentionRecommendation()}
                  readOnly
                  rows={4}
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />

              </div>
              <div className="mb-6">

                <label className="font-semibold block mb-2">
                  Promo Expired Date
                </label>

                <input
                  type="date"
                  value={expiredDate}
                  onChange={(e) => setExpiredDate(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

              </div>
              <div className="mb-4">

                <label className="font-semibold block mb-2">
                  Promo Name
                </label>

                <input
                  type="text"
                  value={promoName}
                  onChange={(e) => setPromoName(e.target.value)}
                  placeholder="Ex: Premium Comeback Promo"
                  className="w-full border rounded-lg p-3"
                />

              </div>

              <div className="mb-6">

                <label className="font-semibold block mb-2">
                  Discount Percentage
                </label>

                <input
                  type="number"
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(e.target.value)}
                  placeholder="Ex: 30"
                  className="w-full border rounded-lg p-3"
                />

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={handleGenerateEmail}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
                >
                  Generate
                </button>

              </div>

            </div>

          </div>
        )
      }

    </div>
  );
}