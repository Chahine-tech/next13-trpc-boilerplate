import AppBar from "@/components/Appbar";
import ListUsers from "@/components/ListUsers";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-8">
        <AppBar />
      </div>
      <ListUsers />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Home;
