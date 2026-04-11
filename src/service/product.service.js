import { auth } from "@/app/auth";

export const getTopSellingProducts = async () => {
  try {
    const session = await auth();
    const token = session?.user?.accessToken;

    console.log("TOKEN:", token);

    if (!token) {
      console.warn("No authentication token available");
      return null;
    }

    const response = await fetch(
      `${process.env.AUTH_API_URL}/products/top-selling`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        `API Error: ${response.status}`,
        await response.text(),
      );
      return null;
    }

    const data = await response.json();

    console.log("API RESPONSE:", data);

    return data;
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    return null;
  }
};
