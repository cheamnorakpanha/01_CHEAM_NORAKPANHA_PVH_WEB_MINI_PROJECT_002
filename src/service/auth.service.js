const loginService = async (request) => {
  const user = {
    email: request.email,
    password: request.password,
  };

  const response = await fetch(
    `${process.env.AUTH_API_URL}/auths/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    },
  );

  const loggedInUser = await response.json();
  return loggedInUser;
};

export { loginService };
