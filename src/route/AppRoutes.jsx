import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Opening from '../pages/startPage/OpeningPage';
import LandingPage from '../pages/startPage/LandingPage';
import SignUpPage from '../pages/Login/SignUpPage';
import LoginPage from '../pages/Login/LoginPage';
import CrewSelectPage from '../pages/JoinCreateCrew/CrewSelectPage';
import CreateCrewPage from '../pages/JoinCreateCrew/CreateCrewPage';
import JoinCrewPage from '../pages/JoinCreateCrew/JoinCrewPage';
import FindRoutePage from '../pages/routePage/FindRoutePage';
import LoadingPage from '../pages/routePage/LoadingPage';
import SuggestedRoutePage from '../pages/routePage/SuggestedRoutePage';
import RouteViewPage from '../pages/routePage/RouteViewPage';
import StoreListPage from '../pages/routePage/StoreListPage';
import GroupVerificationPage from '../pages/routePage/GroupVerificationPage';
import SearchingCrewPage from '../pages/routePage/SearchingCrewsPage';
import GeneratingQRPage from '../pages/routePage/GeneratingQRPage';
import FailurePage from '../pages/routePage/FailurePage';
import QRPage from '../pages/routePage/QRPage';
import FullMapPage from '../pages/homePage/FullMapPage';
import DetailedLocationPage from '../pages/homePage/DetailedLocationPage';
import RecordWritePage from '../pages/homePage/RecordWritePage';
import MyCrewPage from '../pages/myCrewPage/MyCrewPage';
import MemberListPage from '../pages/myCrewPage/MemberListPage';
import NoticeDetailsPage from '../pages/myCrewPage/NoticeDetailsPage';
import CreateNoticePage from '../pages/myCrewPage/CreateNoticePage';
import MyPage from '../pages/myPage/MyPage';
import LevelListPage from '../pages/myPage/LevelListPage';
import TestMap from '../pages/TestMap';
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Opening />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/users/signup" element={<SignUpPage />} />
      <Route path="/users/login" element={<LoginPage />} />
      <Route path="/crew-select" element={<CrewSelectPage />} />
      <Route path="/crews" element={<CreateCrewPage />} />
      <Route path="/crews/join" element={<JoinCrewPage />} />
      <Route path="/find-route" element={<FindRoutePage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/suggested-route" element={<SuggestedRoutePage />} />
      <Route path="/route-view" element={<RouteViewPage />} />
      <Route path="/store-list" element={<StoreListPage/>} />
      <Route path="/group-verification" element={<GroupVerificationPage />} />
      <Route path="/searching-crews" element={<SearchingCrewPage />} />
      <Route path="/generating-qr" element={<GeneratingQRPage />} />
      <Route path="/failure" element={<FailurePage />} />
      <Route path="/qr" element={<QRPage />} />
      <Route path="/fullmap/:user_id" element={<FullMapPage />} />
      <Route path="/location/:id" element={<DetailedLocationPage />} />
      <Route path="/record-write" element={<RecordWritePage />} />
      <Route path="/mycrew/:crew_id" element={<MyCrewPage />} />
      <Route path="/memberlist/:crew_id" element={<MemberListPage />} />
      <Route path="/notice-details/:crew_id/:notice_id" element={<NoticeDetailsPage />} />
      <Route path="/create-notice" element={<CreateNoticePage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/level-list" element={<LevelListPage />} />
      <Route path="/test-map" element={<TestMap />} />
    </Routes>

    // navigate(`/notice-details/${notice.id}`);
  );
}

export default AppRoutes;
