import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import OTP from "./OTP.jsx";
import NewAcc from "./NewAcc.jsx";
import TestAPI from "./TestAPI.jsx";
import LoginSuccess from "./LoginSuccess.jsx";
import LoginRegister from "./LoginRegister.jsx";
import Prediction from "./prediction.jsx";
import Logout from "./logout.jsx";
import LogoutAlert from "./logoutConfirm.jsx";
import { NotificationProvider } from "./NotificationContext.jsx";
import CostumerDetail from "./costumerDetail.jsx";
import Validation from "./validation.jsx";
import DashboardUser from "./DashboardUser.jsx";
import UploadData from "./UploadData.jsx"
import ValidasiProses from "./validasiProses.jsx";
import DashboardDetail from "./DashboardDetail.jsx";
import Member from "./Member.jsx";
import MemberPayment from "./MemberPayment.jsx";
import Feedback from "./Feedback.jsx";
import RiwayatPrediksi from "./RiwayatPrediksi.jsx";
import LandingPage from "./LandingPage.jsx";
import AnalisisUlasan from "./AnalisisUlasan.jsx";
import DashboarHistory from "./DashboardHistory.jsx";
import ProfilePage from "./ProfilePage.jsx";
import SentimenAnalysis from "./SentimenAnalysis.jsx";
import ForgetPass from "./ForgetPass.jsx";
import HistoryPayment from "./HistoryPayment.jsx";
import DashboardSA from "./DashboardSA.jsx";
import UserManagement from "./UserManagement.jsx";
import TambahAdm from "./TambahAdm.jsx";
import FeedBack from "./FeedbackSA.jsx";
import Reports from "./Reports.jsx";
import Rekappayment from "./Rekappayment.jsx";
import PengaturanTier from "./PengaturanTier.jsx";
import EditTier from "./EditTier.jsx";
import History from "./HistorySA.jsx";
import ProfilePageSA from "./ProfilePageSA.jsx";
export default function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ProfilePageSA" element={<ProfilePageSA />} />
        <Route path="/history-sa" element={<History />} />
        <Route path="/pengaturan-tier" element={<PengaturanTier/>}/>
        <Route path="/edit-tier" element={<EditTier/>}/>
        <Route path="/edit-tier/:id" element={<EditTier />} />
        <Route path="/rekap-payment" element={<Rekappayment/>}/>
        <Route path="/reports" element={<Reports />}/>
        <Route path="/feedbackSA" element={<FeedBack />}/>
        <Route path="/TambahAdm" element={<TambahAdm />}/>
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/dashboardSA" element={<DashboardSA />} />
        <Route path="/historyPayment" element={<HistoryPayment />} />
        <Route path="/forgetpass" element={<ForgetPass />} />
        <Route path="/sentimenAnalysis" element={<SentimenAnalysis />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboardhistory" element={<DashboarHistory />} />
        <Route path="/analisisUlasan" element={<AnalisisUlasan />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/dashboardUser" element={<DashboardUser />} />
        <Route path="/uploadData" element={<UploadData />} />
        <Route path="/validasiproses" element={<ValidasiProses />} />
        <Route path="/dashboardDetail" element={<DashboardDetail />} />
        <Route path="/member" element={<Member />} />
        <Route path="/memberPayment" element={<MemberPayment />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/riwayatPrediksi" element={<RiwayatPrediksi />} />
        <Route path="/costumerdetail" element={<CostumerDetail />} />
        <Route path="/validation" element={<Validation />} />
        <Route path="/test" element={<TestAPI />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/newacc" element={<NewAcc />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/OTP" element={<OTP />} />
        <Route path="/NewAcc" element={<NewAcc />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </NotificationProvider>
  );
}
