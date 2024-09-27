import Image from "next/image";
import styles from "./page.module.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TableComponent from "./components/Table";

export default function Home() {
  return (
    <div>
      <Sidebar />
      <Header />
      <TableComponent />
    </div>
  );
}
