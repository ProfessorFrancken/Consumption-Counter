import React from "react";
import {Navigate, Routes, Route} from "react-router-dom";
import SurnameRanges from "App/SurnameRanges";
import SelectMemberFromSurnameRange from "App/SurnameRanges/SelectMemberFromSurnameRange";
import BuyProducts from "App/Products/";
import PriceList from "App/Products/PriceList/";
import Prominent from "./Prominent/";
import Committees from "./Committees/";
import SelectMemberFromCommittee from "./Committees/SelectMemberFromCommittee";
import RecentMembers from "./Recent/";
import Compucie from "./Committees/Compucie/";
import Authenticate from "./Settings/Authentication/";
import Settings from "./Settings/";
import Statistics from "./Statistics/";
import Present from "./Present/";
import Loading from "Loading";

export const AppContent = () => (
  <Routes>
    <Route path="/loading" element={<Loading />} />
    <Route path="/" element={<SurnameRanges />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/authenticate" element={<Authenticate />} />
    <Route path="/compucie" element={<Compucie />} />
    <Route path="/prominent" element={<Prominent />} />
    <Route path="/statistics" element={<Statistics />} />
    <Route path="/committees" element={<Committees />} />
    <Route path="/committees/:page" element={<SelectMemberFromCommittee />} />
    <Route path="/pricelist" element={<PriceList />} />
    <Route path="/recent" element={<RecentMembers />} />
    <Route path="/products" element={<BuyProducts />} />
    <Route path="/statistics" element={<Statistics />} />
    <Route path="/present" element={<Present />} />
    <Route path="/members/:page" element={<SelectMemberFromSurnameRange />} />
    <Route path="/members" element={<Navigate to="/" />} />
  </Routes>
);
