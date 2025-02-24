import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("authenticatedUser");
    if (!user) {
      router.replace("/Login");
    }
  }, []);
};

export default useAuth;
