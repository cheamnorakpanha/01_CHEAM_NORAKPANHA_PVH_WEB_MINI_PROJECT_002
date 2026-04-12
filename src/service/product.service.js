import { auth } from "@/app/auth";

const getTopSellingProducts = async () => {
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
      console.log(`API Error: ${response.status}`, await response.text());
      return null;
    }

    const data = await response.json();

    // console.log("API RESPONSE:", data);

    return data;
  } catch (error) {
    console.log("Error fetching top selling products:", error);
    return null;
  }
};

const getAllProducts = async (token) => {
  try {
    if (!token) {
      console.warn("No authentication token available");
      return [];
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/products`;

    console.log("FETCH URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log("API Error:", response.status, await response.text());
      return [];
    }

    const result = await response.json();
    
    console.log("API RESULT:", result);

    return result?.payload || [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

const getProductsByCategory = async (categoryId, token) => {
  try {
    if (!token) {
      console.warn("No authentication token available");
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/category/${categoryId}`,
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
      console.log("API Error:", response.status, await response.text());
      return [];
    }

    const result = await response.json();
    return result?.payload || [];
  } catch (error) {
    console.log("Error fetching category products:", error);
    return [];
  }
};

export { getTopSellingProducts, getAllProducts, getProductsByCategory };
