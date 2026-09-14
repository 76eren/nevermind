type LoginRequest = {
  username?: unknown;
  password?: unknown;
  firstname?: unknown;
  lastname?: unknown;
  email?: unknown;
};

export async function POST(request: Request) {
  let body: LoginRequest;

  try {
    body = (await request.json()) as LoginRequest;
  } catch {
    return Response.json(
      {
        message: "Invalid JSON request.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    typeof body.firstname !== "string" ||
    typeof body.lastname !== "string" ||
    typeof body.email !== "string" ||
    body.username.trim() === "" ||
    body.password === ""
  ) {
    return Response.json(
      {
        message: "All fields are required are required.",
      },
      {
        status: 400,
      },
    );
  }

  await dummy_request();

  return Response.json(
    {
      message: "Authentication has not been implemented yet.",
    },
    {
      status: 501,
    },
  );
}

async function dummy_request() {
  let endpoint = "https://jsonplaceholder.typicode.com/todos/1";

  type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };

  const response = await fetch(endpoint);
  const data: Todo = await response.json();
  console.log(data);
}
