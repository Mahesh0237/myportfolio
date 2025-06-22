import { Manrope } from "next/font/google";
import "./globals.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanyInformationwrapper from "@/components/CompanyInformationwrapper";


const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Diary Souls",
  description: "A blog about life, love, and everything in between.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-tailify-theme-variant="light">
      <body
        className={`${manrope.variable} antialiased`}
      >
        <ToastContainer />
        <CompanyInformationwrapper />
        {children}
      </body>
    </html>
  );
}
